module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
    schema: [],
    messages: {
      mergeEventHandler:
        'When using spread props, event handler {{handlerName}} should be merged with compose to avoid unintentional overrides. Use: {{handlerName}}={{compose({{spreadPropName}}.{{handlerName}}, {{currentHandler}})}}',
    },
  },
  create(context) {
    // List of common React event handler prop names
    const eventHandlerNames = [
      'onClick',
      'onChange',
      'onSubmit',
      'onFocus',
      'onBlur',
      'onMouseEnter',
      'onMouseLeave',
      'onMouseDown',
      'onMouseUp',
      'onKeyDown',
      'onKeyUp',
      'onKeyPress',
      'onInput',
      'onScroll',
      'onWheel',
      'onDrag',
      'onDragEnd',
      'onDragEnter',
      'onDragExit',
      'onDragLeave',
      'onDragOver',
      'onDragStart',
      'onDrop',
      'onTouchCancel',
      'onTouchEnd',
      'onTouchMove',
      'onTouchStart',
      'onPointerDown',
      'onPointerMove',
      'onPointerUp',
      'onPointerCancel',
      'onPointerEnter',
      'onPointerLeave',
      'onPointerOver',
      'onPointerOut',
      'onSelect',
      'onLoad',
      'onError',
      'onAbort',
      'onCanPlay',
      'onCanPlayThrough',
      'onDurationChange',
      'onEmptied',
      'onEncrypted',
      'onEnded',
      'onLoadedData',
      'onLoadedMetadata',
      'onLoadStart',
      'onPause',
      'onPlay',
      'onPlaying',
      'onProgress',
      'onRateChange',
      'onSeeked',
      'onSeeking',
      'onStalled',
      'onSuspend',
      'onTimeUpdate',
      'onVolumeChange',
      'onWaiting',
    ]

    return {
      JSXOpeningElement(node) {
        const attributes = node.attributes

        // Find spread props and event handlers
        const spreadProps = []
        const eventHandlers = []

        for (const attr of attributes) {
          if (attr.type === 'JSXSpreadAttribute') {
            spreadProps.push(attr)
          } else if (
            attr.type === 'JSXAttribute' &&
            attr.name &&
            attr.name.name &&
            eventHandlerNames.includes(attr.name.name)
          ) {
            eventHandlers.push(attr)
          }
        }

        // Only report if we have both spread props and event handlers
        if (spreadProps.length === 0 || eventHandlers.length === 0) {
          return
        }

        const sourceCode = context.sourceCode

        // Check each event handler
        for (const handler of eventHandlers) {
          const handlerIndex = attributes.indexOf(handler)
          const hasSpreadBeforeHandler = spreadProps.some(spread => {
            return attributes.indexOf(spread) < handlerIndex
          })

          if (!hasSpreadBeforeHandler) {
            continue
          }

          // Check if handler value is already using compose or similar merging
          const handlerValue = handler.value
          if (handlerValue && handlerValue.type === 'JSXExpressionContainer') {
            const expression = handlerValue.expression
            // Check if it's a call expression with compose or similar
            if (
              expression.type === 'CallExpression' &&
              expression.callee.type === 'Identifier' &&
              (expression.callee.name === 'compose' ||
                expression.callee.name === 'composeEventHandlers' ||
                expression.callee.name === 'composeHandlers')
            ) {
              // Already using a handler composition utility, don't report
              continue
            }
          }

          // Get the name of the spread prop (e.g., "rest", "props", etc.)
          const firstSpreadBeforeHandler = spreadProps
            .filter(spread => attributes.indexOf(spread) < handlerIndex)
            .sort((a, b) => attributes.indexOf(a) - attributes.indexOf(b))[0]

          const spreadArgument = firstSpreadBeforeHandler.argument
          const spreadPropName = spreadArgument.name || sourceCode.getText(spreadArgument)

          // Get current handler value as string
          let currentHandler = ''
          if (handlerValue && handlerValue.type === 'JSXExpressionContainer') {
            currentHandler = sourceCode.getText(handlerValue.expression)
          }

          const handlerName = handler.name.name

          // Don't provide a fix if handlerValue is null/undefined or currentHandler is empty
          if (!handlerValue || !currentHandler) {
            context.report({
              node: handler,
              messageId: 'mergeEventHandler',
              data: {
                handlerName,
                spreadPropName,
                currentHandler: '<empty>',
              },
            })
            continue
          }

          context.report({
            node: handler,
            messageId: 'mergeEventHandler',
            data: {
              handlerName,
              spreadPropName,
              currentHandler,
            },
            fix(fixer) {
              // Create the merged event handler expression
              const mergedHandler = `{compose(${spreadPropName}.${handlerName}, ${currentHandler})}`
              return fixer.replaceText(handlerValue, mergedHandler)
            },
          })
        }
      },
    }
  },
}
