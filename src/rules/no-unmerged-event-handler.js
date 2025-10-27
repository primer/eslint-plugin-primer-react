// Common event handler prop names
const EVENT_HANDLER_PROPS = [
  'onClick',
  'onChange',
  'onSubmit',
  'onFocus',
  'onBlur',
  'onKeyDown',
  'onKeyUp',
  'onKeyPress',
  'onMouseDown',
  'onMouseUp',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseMove',
  'onMouseOver',
  'onMouseOut',
  'onTouchStart',
  'onTouchEnd',
  'onTouchMove',
  'onTouchCancel',
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
  'onInput',
  'onInvalid',
  'onSelect',
  'onContextMenu',
  'onDoubleClick',
  'onAnimationStart',
  'onAnimationEnd',
  'onAnimationIteration',
  'onTransitionEnd',
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

module.exports = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      noUnmergedEventHandler:
        'Event handler {{handlerName}} may not be merged correctly with spread props. Consider using a compose function like compose({{handlerName}}, ...) to merge event handlers from spread props.',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const attributes = node.attributes

        // Check if there's a spread attribute
        const hasSpreadAttribute = attributes.some(attr => attr.type === 'JSXSpreadAttribute')
        if (!hasSpreadAttribute) {
          return
        }

        // Check for event handler attributes
        const eventHandlers = attributes.filter(
          attr =>
            attr.type === 'JSXAttribute' && attr.name && attr.name.name && EVENT_HANDLER_PROPS.includes(attr.name.name),
        )

        if (eventHandlers.length === 0) {
          return
        }

        // Find the first spread attribute index
        const spreadIndex = attributes.findIndex(attr => attr.type === 'JSXSpreadAttribute')

        // Check each event handler
        for (const handler of eventHandlers) {
          const handlerIndex = attributes.findIndex(attr => attr === handler)

          if (spreadIndex < handlerIndex) {
            // Event handler comes after spread, check if it's merging properly
            if (handler.value && handler.value.type === 'JSXExpressionContainer') {
              const expression = handler.value.expression

              // Check if it's a call to compose or similar merging function
              if (expression.type === 'CallExpression') {
                const callee = expression.callee
                // If it's calling compose or similar, assume it's merging correctly
                if (
                  callee.type === 'Identifier' &&
                  (callee.name === 'compose' || callee.name === 'composeEventHandlers')
                ) {
                  continue // This is likely merging correctly
                }
              }
            }

            // Event handler is not merging - report it
            context.report({
              node: handler,
              messageId: 'noUnmergedEventHandler',
              data: {
                handlerName: handler.name.name,
              },
            })
          }
        }
      },
    }
  },
}
