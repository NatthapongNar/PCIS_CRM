import { getRect, getBox, withScroll, createBox, calculateBox } from 'css-box-model';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import memoizeOne from 'memoize-one';
import _extends from 'babel-runtime/helpers/extends';
import invariant from 'tiny-invariant';
import _typeof from 'babel-runtime/helpers/typeof';
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import _Object$assign from 'babel-runtime/core-js/object/assign';
import rafSchd from 'raf-schd';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component, PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';

var add = function add(point1, point2) {
  return {
    x: point1.x + point2.x,
    y: point1.y + point2.y
  };
};

var subtract = function subtract(point1, point2) {
  return {
    x: point1.x - point2.x,
    y: point1.y - point2.y
  };
};

var isEqual = function isEqual(point1, point2) {
  return point1.x === point2.x && point1.y === point2.y;
};

var negate = function negate(point) {
  return {
    x: point.x !== 0 ? -point.x : 0,
    y: point.y !== 0 ? -point.y : 0
  };
};

var absolute = function absolute(point) {
  return {
    x: Math.abs(point.x),
    y: Math.abs(point.y)
  };
};

var patch = function patch(line, value) {
  var _ref;

  var otherValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  return _ref = {}, _ref[line] = value, _ref[line === 'x' ? 'y' : 'x'] = otherValue, _ref;
};

var distance = function distance(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

var closest = function closest(target, points) {
  return Math.min.apply(Math, points.map(function (point) {
    return distance(target, point);
  }));
};

var apply = function apply(fn) {
  return function (point) {
    return {
      x: fn(point.x),
      y: fn(point.y)
    };
  };
};

var origin = { x: 0, y: 0 };

var noMovement = {
  displaced: [],
  amount: origin,
  isBeyondStartPosition: false
};

var noImpact = {
  movement: noMovement,
  direction: null,
  destination: null
};

var getDraggablesInsideDroppable = memoizeOne(function (droppable, draggables) {
  return _Object$keys(draggables).map(function (id) {
    return draggables[id];
  }).filter(function (draggable) {
    return droppable.descriptor.id === draggable.descriptor.droppableId;
  }).sort(function (a, b) {
    return a.descriptor.index - b.descriptor.index;
  });
});

var isWithin = (function (lowerBound, upperBound) {
  return function (value) {
    return value <= upperBound && value >= lowerBound;
  };
});

var isPositionInFrame = (function (frame) {
  var isWithinVertical = isWithin(frame.top, frame.bottom);
  var isWithinHorizontal = isWithin(frame.left, frame.right);

  return function (point) {
    return isWithinVertical(point.y) && isWithinVertical(point.y) && isWithinHorizontal(point.x) && isWithinHorizontal(point.x);
  };
});

var offsetByPosition = function offsetByPosition(spacing, point) {
  return {
    top: spacing.top + point.y,
    left: spacing.left + point.x,
    bottom: spacing.bottom + point.y,
    right: spacing.right + point.x
  };
};

var expandByPosition = function expandByPosition(spacing, position) {
  return {
    top: spacing.top - position.y,
    left: spacing.left - position.x,

    right: spacing.right + position.x,
    bottom: spacing.bottom + position.y
  };
};

var getCorners = function getCorners(spacing) {
  return [{ x: spacing.left, y: spacing.top }, { x: spacing.right, y: spacing.top }, { x: spacing.left, y: spacing.bottom }, { x: spacing.right, y: spacing.bottom }];
};

var vertical = {
  direction: 'vertical',
  line: 'y',
  crossAxisLine: 'x',
  start: 'top',
  end: 'bottom',
  size: 'height',
  crossAxisStart: 'left',
  crossAxisEnd: 'right',
  crossAxisSize: 'width'
};

var horizontal = {
  direction: 'horizontal',
  line: 'x',
  crossAxisLine: 'y',
  start: 'left',
  end: 'right',
  size: 'width',
  crossAxisStart: 'top',
  crossAxisEnd: 'bottom',
  crossAxisSize: 'height'
};

var getMaxScroll = (function (_ref) {
  var scrollHeight = _ref.scrollHeight,
      scrollWidth = _ref.scrollWidth,
      height = _ref.height,
      width = _ref.width;

  var maxScroll = subtract({ x: scrollWidth, y: scrollHeight }, { x: width, y: height });

  var adjustedMaxScroll = {
    x: Math.max(0, maxScroll.x),
    y: Math.max(0, maxScroll.y)
  };

  return adjustedMaxScroll;
});

var clip = function clip(frame, subject) {
  var result = getRect({
    top: Math.max(subject.top, frame.top),
    right: Math.min(subject.right, frame.right),
    bottom: Math.min(subject.bottom, frame.bottom),
    left: Math.max(subject.left, frame.left)
  });

  if (result.width <= 0 || result.height <= 0) {
    return null;
  }

  return result;
};

var origin$1 = { x: 0, y: 0 };

var getDroppableDimension = function getDroppableDimension(_ref) {
  var descriptor = _ref.descriptor,
      isEnabled = _ref.isEnabled,
      direction = _ref.direction,
      client = _ref.client,
      page = _ref.page,
      closest$$1 = _ref.closest;

  var scrollable = function () {
    if (!closest$$1) {
      return null;
    }

    var maxScroll = getMaxScroll({
      scrollHeight: closest$$1.scrollHeight,
      scrollWidth: closest$$1.scrollWidth,
      height: closest$$1.client.paddingBox.height,
      width: closest$$1.client.paddingBox.width
    });

    return {
      framePageMarginBox: closest$$1.page.marginBox,
      shouldClipSubject: closest$$1.shouldClipSubject,
      scroll: {
        initial: closest$$1.scroll,
        current: closest$$1.scroll,
        max: maxScroll,
        diff: {
          value: origin$1,
          displacement: origin$1
        }
      }
    };
  }();

  var subjectPageMarginBox = page.marginBox;

  var clippedPageMarginBox = scrollable && scrollable.shouldClipSubject ? clip(scrollable.framePageMarginBox, subjectPageMarginBox) : subjectPageMarginBox;

  var viewport = {
    closestScrollable: scrollable,
    subjectPageMarginBox: subjectPageMarginBox,
    clippedPageMarginBox: clippedPageMarginBox
  };

  var dimension = {
    descriptor: descriptor,
    axis: direction === 'vertical' ? vertical : horizontal,
    isEnabled: isEnabled,
    client: client,
    page: page,
    viewport: viewport
  };

  return dimension;
};

var scrollDroppable = function scrollDroppable(droppable, newScroll) {
  invariant(droppable.viewport.closestScrollable);

  var scrollable = droppable.viewport.closestScrollable;
  var framePageMarginBox = scrollable.framePageMarginBox;

  var scrollDiff = subtract(newScroll, scrollable.scroll.initial);

  var scrollDisplacement = negate(scrollDiff);

  var closestScrollable = {
    framePageMarginBox: scrollable.framePageMarginBox,
    shouldClipSubject: scrollable.shouldClipSubject,
    scroll: {
      initial: scrollable.scroll.initial,
      current: newScroll,
      diff: {
        value: scrollDiff,
        displacement: scrollDisplacement
      },

      max: scrollable.scroll.max
    }
  };

  var displacedSubject = offsetByPosition(droppable.viewport.subjectPageMarginBox, scrollDisplacement);

  var clippedPageMarginBox = closestScrollable.shouldClipSubject ? clip(framePageMarginBox, displacedSubject) : getRect(displacedSubject);

  var viewport = {
    closestScrollable: closestScrollable,
    subjectPageMarginBox: droppable.viewport.subjectPageMarginBox,
    clippedPageMarginBox: clippedPageMarginBox
  };

  var result = _extends({}, droppable, {
    viewport: viewport
  });
  return result;
};

var getRequiredGrowth = memoizeOne(function (draggable, draggables, droppable) {

  var getResult = function getResult(existingSpace) {
    var requiredSpace = draggable.page.marginBox[droppable.axis.size];

    if (requiredSpace <= existingSpace) {
      return null;
    }
    var requiredGrowth = patch(droppable.axis.line, requiredSpace - existingSpace);

    return requiredGrowth;
  };

  var dimensions = getDraggablesInsideDroppable(droppable, draggables);

  if (!dimensions.length) {
    var _existingSpace = droppable.page.marginBox[droppable.axis.size];
    return getResult(_existingSpace);
  }

  var endOfDraggables = dimensions[dimensions.length - 1].page.marginBox[droppable.axis.end];
  var endOfDroppable = droppable.page.marginBox[droppable.axis.end];
  var existingSpace = endOfDroppable - endOfDraggables;

  return getResult(existingSpace);
});

var getWithGrowth = memoizeOne(function (area, growth) {
  return getRect(expandByPosition(area, growth));
});

var getClippedRectWithPlaceholder = function getClippedRectWithPlaceholder(_ref) {
  var draggable = _ref.draggable,
      draggables = _ref.draggables,
      droppable = _ref.droppable,
      previousDroppableOverId = _ref.previousDroppableOverId;

  var isHome = draggable.descriptor.droppableId === droppable.descriptor.id;
  var wasOver = Boolean(previousDroppableOverId && previousDroppableOverId === droppable.descriptor.id);
  var clippedPageMarginBox = droppable.viewport.clippedPageMarginBox;

  if (!clippedPageMarginBox) {
    return clippedPageMarginBox;
  }

  if (isHome || !wasOver) {
    return clippedPageMarginBox;
  }

  var requiredGrowth = getRequiredGrowth(draggable, draggables, droppable);

  if (!requiredGrowth) {
    return clippedPageMarginBox;
  }

  var subjectWithGrowth = getWithGrowth(clippedPageMarginBox, requiredGrowth);
  var closestScrollable = droppable.viewport.closestScrollable;

  if (!closestScrollable) {
    return subjectWithGrowth;
  }

  if (!closestScrollable.shouldClipSubject) {
    return subjectWithGrowth;
  }

  return clip(closestScrollable.framePageMarginBox, subjectWithGrowth);
};

var getDroppableOver = (function (_ref2) {
  var target = _ref2.target,
      draggable = _ref2.draggable,
      draggables = _ref2.draggables,
      droppables = _ref2.droppables,
      previousDroppableOverId = _ref2.previousDroppableOverId;

  var maybe = _Object$keys(droppables).map(function (id) {
    return droppables[id];
  }).filter(function (droppable) {
    return droppable.isEnabled;
  }).find(function (droppable) {
    var withPlaceholder = getClippedRectWithPlaceholder({
      draggable: draggable, draggables: draggables, droppable: droppable, previousDroppableOverId: previousDroppableOverId
    });

    if (!withPlaceholder) {
      return false;
    }

    return isPositionInFrame(withPlaceholder)(target);
  });

  return maybe ? maybe.descriptor.id : null;
});

var getDisplacementMap = memoizeOne(function (displaced) {
  return displaced.reduce(function (map, displacement) {
    map[displacement.draggableId] = displacement;
    return map;
  }, {});
});

var isPartiallyVisibleThroughFrame = (function (frame) {
  var isWithinVertical = isWithin(frame.top, frame.bottom);
  var isWithinHorizontal = isWithin(frame.left, frame.right);

  return function (subject) {
    var isContained = isWithinVertical(subject.top) && isWithinVertical(subject.bottom) && isWithinHorizontal(subject.left) && isWithinHorizontal(subject.right);

    if (isContained) {
      return true;
    }

    var isPartiallyVisibleVertically = isWithinVertical(subject.top) || isWithinVertical(subject.bottom);
    var isPartiallyVisibleHorizontally = isWithinHorizontal(subject.left) || isWithinHorizontal(subject.right);

    var isPartiallyContained = isPartiallyVisibleVertically && isPartiallyVisibleHorizontally;

    if (isPartiallyContained) {
      return true;
    }

    var isBiggerVertically = subject.top < frame.top && subject.bottom > frame.bottom;
    var isBiggerHorizontally = subject.left < frame.left && subject.right > frame.right;

    var isTargetBiggerThanFrame = isBiggerVertically && isBiggerHorizontally;

    if (isTargetBiggerThanFrame) {
      return true;
    }

    var isTargetBiggerOnOneAxis = isBiggerVertically && isPartiallyVisibleHorizontally || isBiggerHorizontally && isPartiallyVisibleVertically;

    return isTargetBiggerOnOneAxis;
  };
});

var isTotallyVisibleThroughFrame = (function (frame) {
  var isWithinVertical = isWithin(frame.top, frame.bottom);
  var isWithinHorizontal = isWithin(frame.left, frame.right);

  return function (subject) {
    var isContained = isWithinVertical(subject.top) && isWithinVertical(subject.bottom) && isWithinHorizontal(subject.left) && isWithinHorizontal(subject.right);

    return isContained;
  };
});

var origin$2 = { x: 0, y: 0 };

var isVisible = function isVisible(_ref) {
  var target = _ref.target,
      destination = _ref.destination,
      viewport = _ref.viewport,
      isVisibleThroughFrameFn = _ref.isVisibleThroughFrameFn;

  var displacement = destination.viewport.closestScrollable ? destination.viewport.closestScrollable.scroll.diff.displacement : origin$2;
  var withDisplacement = offsetByPosition(target, displacement);

  if (!destination.viewport.clippedPageMarginBox) {
    return false;
  }

  var isVisibleInDroppable = isVisibleThroughFrameFn(destination.viewport.clippedPageMarginBox)(withDisplacement);

  var isVisibleInViewport = isVisibleThroughFrameFn(viewport)(withDisplacement);

  return isVisibleInDroppable && isVisibleInViewport;
};

var isPartiallyVisible = function isPartiallyVisible(_ref2) {
  var target = _ref2.target,
      destination = _ref2.destination,
      viewport = _ref2.viewport;
  return isVisible({
    target: target,
    destination: destination,
    viewport: viewport,
    isVisibleThroughFrameFn: isPartiallyVisibleThroughFrame
  });
};

var isTotallyVisible = function isTotallyVisible(_ref3) {
  var target = _ref3.target,
      destination = _ref3.destination,
      viewport = _ref3.viewport;
  return isVisible({
    target: target,
    destination: destination,
    viewport: viewport,
    isVisibleThroughFrameFn: isTotallyVisibleThroughFrame
  });
};

var getDisplacement = (function (_ref) {
  var draggable = _ref.draggable,
      destination = _ref.destination,
      previousImpact = _ref.previousImpact,
      viewport = _ref.viewport;

  var id = draggable.descriptor.id;
  var map = getDisplacementMap(previousImpact.movement.displaced);

  var isVisible = isPartiallyVisible({
    target: draggable.page.marginBox,
    destination: destination,
    viewport: viewport
  });

  var shouldAnimate = function () {
    if (!isVisible) {
      return false;
    }

    var previous = map[id];

    if (!previous) {
      return true;
    }

    return previous.shouldAnimate;
  }();

  var displacement = {
    draggableId: id,
    isVisible: isVisible,
    shouldAnimate: shouldAnimate
  };

  return displacement;
});

var withDroppableScroll = (function (droppable, point) {
  var closestScrollable = droppable.viewport.closestScrollable;
  if (!closestScrollable) {
    return point;
  }

  return add(point, closestScrollable.scroll.diff.value);
});

var inHomeList = (function (_ref) {
  var pageBorderBoxCenter = _ref.pageBorderBoxCenter,
      draggable = _ref.draggable,
      home = _ref.home,
      insideHome = _ref.insideHome,
      previousImpact = _ref.previousImpact,
      viewport = _ref.viewport;

  var axis = home.axis;

  var originalCenter = draggable.page.borderBox.center;

  var currentCenter = withDroppableScroll(home, pageBorderBoxCenter);

  var isBeyondStartPosition = currentCenter[axis.line] - originalCenter[axis.line] > 0;

  var amount = patch(axis.line, draggable.client.marginBox[axis.size]);

  var displaced = insideHome.filter(function (child) {
    if (child === draggable) {
      return false;
    }

    var borderBox = child.page.borderBox;

    if (isBeyondStartPosition) {
      if (borderBox.center[axis.line] < originalCenter[axis.line]) {
        return false;
      }

      return currentCenter[axis.line] > borderBox[axis.start];
    }

    if (originalCenter[axis.line] < borderBox.center[axis.line]) {
      return false;
    }

    return currentCenter[axis.line] < borderBox[axis.end];
  }).map(function (dimension) {
    return getDisplacement({
      draggable: dimension,
      destination: home,
      previousImpact: previousImpact,
      viewport: viewport.subject
    });
  });

  var ordered = isBeyondStartPosition ? displaced.reverse() : displaced;
  var index = function () {
    var startIndex = insideHome.indexOf(draggable);
    var length = ordered.length;
    if (!length) {
      return startIndex;
    }

    if (isBeyondStartPosition) {
      return startIndex + length;
    }

    return startIndex - length;
  }();

  var movement = {
    amount: amount,
    displaced: ordered,
    isBeyondStartPosition: isBeyondStartPosition
  };

  var impact = {
    movement: movement,
    direction: axis.direction,
    destination: {
      droppableId: home.descriptor.id,
      index: index
    }
  };

  return impact;
});

var inForeignList = (function (_ref) {
  var pageBorderBoxCenter = _ref.pageBorderBoxCenter,
      draggable = _ref.draggable,
      destination = _ref.destination,
      insideDestination = _ref.insideDestination,
      previousImpact = _ref.previousImpact,
      viewport = _ref.viewport;

  var axis = destination.axis;

  var currentCenter = withDroppableScroll(destination, pageBorderBoxCenter);

  var displaced = insideDestination.filter(function (child) {
    var threshold = child.page.borderBox[axis.end];
    return threshold > currentCenter[axis.line];
  }).map(function (dimension) {
    return getDisplacement({
      draggable: dimension,
      destination: destination,
      previousImpact: previousImpact,
      viewport: viewport.subject
    });
  });

  var newIndex = insideDestination.length - displaced.length;

  var movement = {
    amount: patch(axis.line, draggable.page.marginBox[axis.size]),
    displaced: displaced,
    isBeyondStartPosition: false
  };

  var impact = {
    movement: movement,
    direction: axis.direction,
    destination: {
      droppableId: destination.descriptor.id,
      index: newIndex
    }
  };

  return impact;
});

var getDragImpact = (function (_ref) {
  var pageBorderBoxCenter = _ref.pageBorderBoxCenter,
      draggable = _ref.draggable,
      draggables = _ref.draggables,
      droppables = _ref.droppables,
      previousImpact = _ref.previousImpact,
      viewport = _ref.viewport;

  var previousDroppableOverId = previousImpact.destination && previousImpact.destination.droppableId;

  var destinationId = getDroppableOver({
    target: pageBorderBoxCenter,
    draggable: draggable,
    draggables: draggables,
    droppables: droppables,
    previousDroppableOverId: previousDroppableOverId
  });

  if (!destinationId) {
    return noImpact;
  }

  var destination = droppables[destinationId];

  if (!destination.isEnabled) {
    return noImpact;
  }

  var home = droppables[draggable.descriptor.droppableId];
  var isWithinHomeDroppable = home.descriptor.id === destinationId;
  var insideDestination = getDraggablesInsideDroppable(destination, draggables);

  if (isWithinHomeDroppable) {
    return inHomeList({
      pageBorderBoxCenter: pageBorderBoxCenter,
      draggable: draggable,
      home: home,
      insideHome: insideDestination,
      previousImpact: previousImpact || noImpact,
      viewport: viewport
    });
  }

  return inForeignList({
    pageBorderBoxCenter: pageBorderBoxCenter,
    draggable: draggable,
    destination: destination,
    insideDestination: insideDestination,
    previousImpact: previousImpact || noImpact,
    viewport: viewport
  });
});

var withDroppableDisplacement = (function (droppable, point) {
  var closestScrollable = droppable.viewport.closestScrollable;
  if (!closestScrollable) {
    return point;
  }

  return add(point, closestScrollable.scroll.diff.displacement);
});

var isTotallyVisibleInNewLocation = (function (_ref) {
  var draggable = _ref.draggable,
      destination = _ref.destination,
      newPageBorderBoxCenter = _ref.newPageBorderBoxCenter,
      viewport = _ref.viewport;

  var diff = subtract(newPageBorderBoxCenter, draggable.page.borderBox.center);
  var shifted = offsetByPosition(draggable.page.borderBox, diff);

  return isTotallyVisible({
    target: shifted,
    destination: destination,
    viewport: viewport
  });
});

var moveToEdge = (function (_ref) {
  var source = _ref.source,
      sourceEdge = _ref.sourceEdge,
      destination = _ref.destination,
      destinationEdge = _ref.destinationEdge,
      destinationAxis = _ref.destinationAxis;

  var getCorner = function getCorner(area) {
    return patch(destinationAxis.line, area[destinationAxis[destinationEdge]], area[destinationAxis.crossAxisStart]);
  };

  var corner = getCorner(destination);

  var centerDiff = absolute(subtract(source.center, getCorner(source)));

  var signed = patch(destinationAxis.line, (sourceEdge === 'end' ? -1 : 1) * centerDiff[destinationAxis.line], centerDiff[destinationAxis.crossAxisLine]);

  return add(corner, signed);
});

var withFirstAdded = function withFirstAdded(_ref) {
  var add = _ref.add,
      previousImpact = _ref.previousImpact,
      droppable = _ref.droppable,
      draggables = _ref.draggables,
      viewport = _ref.viewport;

  var newDisplacement = {
    draggableId: add,
    isVisible: true,
    shouldAnimate: true
  };

  var added = [newDisplacement].concat(previousImpact.movement.displaced);

  var withUpdatedVisibility = added.map(function (current) {
    if (current === newDisplacement) {
      return current;
    }

    var updated = getDisplacement({
      draggable: draggables[current.draggableId],
      destination: droppable,
      previousImpact: previousImpact,
      viewport: viewport.subject
    });

    return updated;
  });

  return withUpdatedVisibility;
};

var forceVisibleDisplacement = function forceVisibleDisplacement(current) {
  if (current.isVisible) {
    return current;
  }

  return {
    draggableId: current.draggableId,
    isVisible: true,
    shouldAnimate: false
  };
};

var withFirstRemoved = function withFirstRemoved(_ref2) {
  var dragging = _ref2.dragging,
      isVisibleInNewLocation = _ref2.isVisibleInNewLocation,
      previousImpact = _ref2.previousImpact,
      droppable = _ref2.droppable,
      draggables = _ref2.draggables;

  var last = previousImpact.movement.displaced;
  if (!last.length) {
    console.error('cannot remove displacement from empty list');
    return [];
  }

  var withFirstRestored = last.slice(1, last.length);

  if (!withFirstRestored.length) {
    return withFirstRestored;
  }

  if (isVisibleInNewLocation) {
    return withFirstRestored;
  }

  var axis = droppable.axis;

  var sizeOfRestored = draggables[last[0].draggableId].page.marginBox[axis.size];
  var sizeOfDragging = draggables[dragging].page.marginBox[axis.size];
  var buffer = sizeOfRestored + sizeOfDragging;

  var withUpdatedVisibility = withFirstRestored.map(function (displacement, index) {
    if (index === 0) {
      return forceVisibleDisplacement(displacement);
    }

    if (buffer > 0) {
      var current = draggables[displacement.draggableId];
      var size = current.page.marginBox[axis.size];
      buffer -= size;

      return forceVisibleDisplacement(displacement);
    }

    return {
      draggableId: displacement.draggableId,
      isVisible: false,
      shouldAnimate: false
    };
  });

  return withUpdatedVisibility;
};

var inHomeList$1 = (function (_ref) {
  var isMovingForward = _ref.isMovingForward,
      draggableId = _ref.draggableId,
      previousPageBorderBoxCenter = _ref.previousPageBorderBoxCenter,
      previousImpact = _ref.previousImpact,
      droppable = _ref.droppable,
      draggables = _ref.draggables,
      viewport = _ref.viewport;

  var location = previousImpact.destination;

  if (!location) {
    console.error('cannot move to next index when there is not previous destination');
    return null;
  }

  var draggable = draggables[draggableId];
  var axis = droppable.axis;

  var insideDroppable = getDraggablesInsideDroppable(droppable, draggables);

  var startIndex = draggable.descriptor.index;
  var currentIndex = location.index;
  var proposedIndex = isMovingForward ? currentIndex + 1 : currentIndex - 1;

  if (startIndex === -1) {
    console.error('could not find draggable inside current droppable');
    return null;
  }

  if (proposedIndex > insideDroppable.length - 1) {
    return null;
  }

  if (proposedIndex < 0) {
    return null;
  }

  var destination = insideDroppable[proposedIndex];
  var isMovingTowardStart = isMovingForward && proposedIndex <= startIndex || !isMovingForward && proposedIndex >= startIndex;

  var edge = function () {
    if (!isMovingTowardStart) {
      return isMovingForward ? 'end' : 'start';
    }

    return isMovingForward ? 'start' : 'end';
  }();

  var newPageBorderBoxCenter = moveToEdge({
    source: draggable.page.borderBox,
    sourceEdge: edge,
    destination: destination.page.borderBox,
    destinationEdge: edge,
    destinationAxis: droppable.axis
  });

  var isVisibleInNewLocation = isTotallyVisibleInNewLocation({
    draggable: draggable,
    destination: droppable,
    newPageBorderBoxCenter: newPageBorderBoxCenter,
    viewport: viewport.subject
  });

  var displaced = function () {
    if (isMovingTowardStart) {
      return withFirstRemoved({
        dragging: draggableId,
        isVisibleInNewLocation: isVisibleInNewLocation,
        previousImpact: previousImpact,
        droppable: droppable,
        draggables: draggables
      });
    }
    return withFirstAdded({
      add: destination.descriptor.id,
      previousImpact: previousImpact,
      droppable: droppable,
      draggables: draggables,
      viewport: viewport
    });
  }();

  var newImpact = {
    movement: {
      displaced: displaced,
      amount: patch(axis.line, draggable.page.marginBox[axis.size]),
      isBeyondStartPosition: proposedIndex > startIndex
    },
    destination: {
      droppableId: droppable.descriptor.id,
      index: proposedIndex
    },
    direction: droppable.axis.direction
  };

  if (isVisibleInNewLocation) {
    return {
      pageBorderBoxCenter: withDroppableDisplacement(droppable, newPageBorderBoxCenter),
      impact: newImpact,
      scrollJumpRequest: null
    };
  }

  var distance$$1 = subtract(newPageBorderBoxCenter, previousPageBorderBoxCenter);
  var distanceWithScroll = withDroppableDisplacement(droppable, distance$$1);

  return {
    pageBorderBoxCenter: previousPageBorderBoxCenter,
    impact: newImpact,
    scrollJumpRequest: distanceWithScroll
  };
});

var inForeignList$1 = (function (_ref) {
  var isMovingForward = _ref.isMovingForward,
      draggableId = _ref.draggableId,
      previousImpact = _ref.previousImpact,
      previousPageBorderBoxCenter = _ref.previousPageBorderBoxCenter,
      droppable = _ref.droppable,
      draggables = _ref.draggables,
      viewport = _ref.viewport;

  if (!previousImpact.destination) {
    console.error('cannot move to next index when there is not previous destination');
    return null;
  }

  var location = previousImpact.destination;
  var draggable = draggables[draggableId];
  var axis = droppable.axis;

  var insideForeignDroppable = getDraggablesInsideDroppable(droppable, draggables);

  var currentIndex = location.index;
  var proposedIndex = isMovingForward ? currentIndex + 1 : currentIndex - 1;
  var lastIndex = insideForeignDroppable.length - 1;

  if (proposedIndex > insideForeignDroppable.length) {
    return null;
  }

  if (proposedIndex < 0) {
    return null;
  }

  var movingRelativeTo = insideForeignDroppable[Math.min(proposedIndex, lastIndex)];

  var isMovingPastLastIndex = proposedIndex > lastIndex;
  var sourceEdge = 'start';
  var destinationEdge = function () {
    if (isMovingPastLastIndex) {
      return 'end';
    }

    return 'start';
  }();

  var newPageBorderBoxCenter = moveToEdge({
    source: draggable.page.borderBox,
    sourceEdge: sourceEdge,
    destination: movingRelativeTo.page.marginBox,
    destinationEdge: destinationEdge,
    destinationAxis: droppable.axis
  });

  var isVisibleInNewLocation = isTotallyVisibleInNewLocation({
    draggable: draggable,
    destination: droppable,
    newPageBorderBoxCenter: newPageBorderBoxCenter,
    viewport: viewport.subject
  });

  var displaced = function () {
    if (isMovingForward) {
      return withFirstRemoved({
        dragging: draggableId,
        isVisibleInNewLocation: isVisibleInNewLocation,
        previousImpact: previousImpact,
        droppable: droppable,
        draggables: draggables
      });
    }
    return withFirstAdded({
      add: movingRelativeTo.descriptor.id,
      previousImpact: previousImpact,
      droppable: droppable,
      draggables: draggables,
      viewport: viewport
    });
  }();

  var newImpact = {
    movement: {
      displaced: displaced,
      amount: patch(axis.line, draggable.page.marginBox[axis.size]),

      isBeyondStartPosition: false
    },
    destination: {
      droppableId: droppable.descriptor.id,
      index: proposedIndex
    },
    direction: droppable.axis.direction
  };

  if (isVisibleInNewLocation) {
    return {
      pageBorderBoxCenter: withDroppableDisplacement(droppable, newPageBorderBoxCenter),
      impact: newImpact,
      scrollJumpRequest: null
    };
  }

  var distanceMoving = subtract(newPageBorderBoxCenter, previousPageBorderBoxCenter);
  var distanceWithScroll = withDroppableDisplacement(droppable, distanceMoving);

  return {
    pageBorderBoxCenter: previousPageBorderBoxCenter,
    impact: newImpact,
    scrollJumpRequest: distanceWithScroll
  };
});

var moveToNextIndex = (function (args) {
  var draggableId = args.draggableId,
      draggables = args.draggables,
      droppable = args.droppable;


  var draggable = draggables[draggableId];
  var isInHomeList = draggable.descriptor.droppableId === droppable.descriptor.id;

  if (!droppable.isEnabled) {
    return null;
  }

  if (isInHomeList) {
    return inHomeList$1(args);
  }

  return inForeignList$1(args);
});

var getSafeClipped = function getSafeClipped(droppable) {
  var rect = droppable.viewport.clippedPageMarginBox;

  invariant(rect, 'Cannot get clipped area from droppable');

  return rect;
};

var getBestCrossAxisDroppable = (function (_ref) {
  var isMovingForward = _ref.isMovingForward,
      pageBorderBoxCenter = _ref.pageBorderBoxCenter,
      source = _ref.source,
      droppables = _ref.droppables,
      viewport = _ref.viewport;

  var sourceClipped = source.viewport.clippedPageMarginBox;

  if (!sourceClipped) {
    return null;
  }

  var axis = source.axis;
  var isBetweenSourceClipped = isWithin(sourceClipped[axis.start], sourceClipped[axis.end]);
  var candidates = _Object$keys(droppables).map(function (id) {
    return droppables[id];
  }).filter(function (droppable) {
    return droppable !== source;
  }).filter(function (droppable) {
    return droppable.isEnabled;
  }).filter(function (droppable) {
    var clippedPageMarginBox = droppable.viewport.clippedPageMarginBox;

    if (!clippedPageMarginBox) {
      return false;
    }

    return isPartiallyVisibleThroughFrame(viewport.subject)(clippedPageMarginBox);
  }).filter(function (droppable) {
    var targetClipped = getSafeClipped(droppable);

    if (isMovingForward) {
      return sourceClipped[axis.crossAxisEnd] <= targetClipped[axis.crossAxisStart];
    }

    return targetClipped[axis.crossAxisEnd] <= sourceClipped[axis.crossAxisStart];
  }).filter(function (droppable) {
    var targetClipped = getSafeClipped(droppable);

    var isBetweenDestinationClipped = isWithin(targetClipped[axis.start], targetClipped[axis.end]);

    return isBetweenSourceClipped(targetClipped[axis.start]) || isBetweenSourceClipped(targetClipped[axis.end]) || isBetweenDestinationClipped(sourceClipped[axis.start]) || isBetweenDestinationClipped(sourceClipped[axis.end]);
  }).sort(function (a, b) {
    var first = getSafeClipped(a)[axis.crossAxisStart];
    var second = getSafeClipped(b)[axis.crossAxisStart];

    if (isMovingForward) {
      return first - second;
    }
    return second - first;
  }).filter(function (droppable, index, array) {
    return getSafeClipped(droppable)[axis.crossAxisStart] === getSafeClipped(array[0])[axis.crossAxisStart];
  });

  if (!candidates.length) {
    return null;
  }

  if (candidates.length === 1) {
    return candidates[0];
  }

  var contains = candidates.filter(function (droppable) {
    var isWithinDroppable = isWithin(getSafeClipped(droppable)[axis.start], getSafeClipped(droppable)[axis.end]);
    return isWithinDroppable(pageBorderBoxCenter[axis.line]);
  });

  if (contains.length === 1) {
    return contains[0];
  }

  if (contains.length > 1) {
    return contains.sort(function (a, b) {
      return getSafeClipped(a)[axis.start] - getSafeClipped(b)[axis.start];
    })[0];
  }

  return candidates.sort(function (a, b) {
    var first = closest(pageBorderBoxCenter, getCorners(getSafeClipped(a)));
    var second = closest(pageBorderBoxCenter, getCorners(getSafeClipped(b)));

    if (first !== second) {
      return first - second;
    }

    return getSafeClipped(a)[axis.start] - getSafeClipped(b)[axis.start];
  })[0];
});

var getClosestDraggable = (function (_ref) {
  var axis = _ref.axis,
      viewport = _ref.viewport,
      pageBorderBoxCenter = _ref.pageBorderBoxCenter,
      destination = _ref.destination,
      insideDestination = _ref.insideDestination;

  if (!insideDestination.length) {
    return null;
  }

  var result = insideDestination.filter(function (draggable) {
    return isTotallyVisible({
      target: draggable.page.borderBox,
      destination: destination,
      viewport: viewport.subject
    });
  }).sort(function (a, b) {
    var distanceToA = distance(pageBorderBoxCenter, withDroppableDisplacement(destination, a.page.borderBox.center));
    var distanceToB = distance(pageBorderBoxCenter, withDroppableDisplacement(destination, b.page.borderBox.center));

    if (distanceToA < distanceToB) {
      return -1;
    }

    if (distanceToB < distanceToA) {
      return 1;
    }

    return a.page.borderBox[axis.start] - b.page.borderBox[axis.start];
  });

  return result.length ? result[0] : null;
});

var toHomeList = (function (_ref) {
  var amount = _ref.amount,
      originalIndex = _ref.originalIndex,
      target = _ref.target,
      insideDroppable = _ref.insideDroppable,
      draggable = _ref.draggable,
      droppable = _ref.droppable,
      previousImpact = _ref.previousImpact,
      viewport = _ref.viewport;

  if (!target) {
    console.error('there will always be a target in the original list');
    return null;
  }

  var axis = droppable.axis;
  var targetIndex = insideDroppable.indexOf(target);

  if (targetIndex === -1) {
    console.error('unable to find target in destination droppable');
    return null;
  }

  if (targetIndex === originalIndex) {
    var _newCenter = draggable.page.borderBox.center;
    var _newImpact = {
      movement: {
        displaced: [],
        amount: amount,
        isBeyondStartPosition: false
      },
      direction: droppable.axis.direction,
      destination: {
        droppableId: droppable.descriptor.id,
        index: originalIndex
      }
    };

    return {
      pageBorderBoxCenter: withDroppableDisplacement(droppable, _newCenter),
      impact: _newImpact
    };
  }

  var isMovingPastOriginalIndex = targetIndex > originalIndex;
  var edge = isMovingPastOriginalIndex ? 'end' : 'start';

  var newCenter = moveToEdge({
    source: draggable.page.borderBox,
    sourceEdge: edge,
    destination: isMovingPastOriginalIndex ? target.page.borderBox : target.page.marginBox,
    destinationEdge: edge,
    destinationAxis: axis
  });

  var modified = function () {
    if (!isMovingPastOriginalIndex) {
      return insideDroppable.slice(targetIndex, originalIndex);
    }

    var from = originalIndex + 1;

    var to = targetIndex + 1;

    return insideDroppable.slice(from, to).reverse();
  }();

  var displaced = modified.map(function (dimension) {
    return getDisplacement({
      draggable: dimension,
      destination: droppable,
      previousImpact: previousImpact,
      viewport: viewport.subject
    });
  });

  var newImpact = {
    movement: {
      displaced: displaced,
      amount: amount,
      isBeyondStartPosition: isMovingPastOriginalIndex
    },
    direction: axis.direction,
    destination: {
      droppableId: droppable.descriptor.id,
      index: targetIndex
    }
  };

  return {
    pageBorderBoxCenter: withDroppableDisplacement(droppable, newCenter),
    impact: newImpact
  };
});

var toForeignList = (function (_ref) {
  var amount = _ref.amount,
      pageBorderBoxCenter = _ref.pageBorderBoxCenter,
      target = _ref.target,
      insideDroppable = _ref.insideDroppable,
      draggable = _ref.draggable,
      droppable = _ref.droppable,
      previousImpact = _ref.previousImpact,
      viewport = _ref.viewport;

  var axis = droppable.axis;
  var isGoingBeforeTarget = Boolean(target && pageBorderBoxCenter[droppable.axis.line] < target.page.borderBox.center[droppable.axis.line]);

  if (!target) {

    var _newCenter = moveToEdge({
      source: draggable.page.borderBox,
      sourceEdge: 'start',
      destination: droppable.page.contentBox,
      destinationEdge: 'start',
      destinationAxis: axis
    });

    var _newImpact = {
      movement: {
        displaced: [],
        amount: amount,
        isBeyondStartPosition: false
      },
      direction: axis.direction,
      destination: {
        droppableId: droppable.descriptor.id,
        index: 0
      }
    };

    return {
      pageBorderBoxCenter: withDroppableDisplacement(droppable, _newCenter),
      impact: _newImpact
    };
  }

  var targetIndex = insideDroppable.indexOf(target);
  var proposedIndex = isGoingBeforeTarget ? targetIndex : targetIndex + 1;

  if (targetIndex === -1) {
    console.error('could not find target inside destination');
    return null;
  }

  var newCenter = moveToEdge({
    source: draggable.page.borderBox,
    sourceEdge: 'start',
    destination: target.page.marginBox,
    destinationEdge: isGoingBeforeTarget ? 'start' : 'end',
    destinationAxis: axis
  });

  var displaced = insideDroppable.slice(proposedIndex, insideDroppable.length).map(function (dimension) {
    return getDisplacement({
      draggable: dimension,
      destination: droppable,
      viewport: viewport.subject,
      previousImpact: previousImpact
    });
  });

  var newImpact = {
    movement: {
      displaced: displaced,
      amount: amount,
      isBeyondStartPosition: false
    },
    direction: axis.direction,
    destination: {
      droppableId: droppable.descriptor.id,
      index: proposedIndex
    }
  };

  return {
    pageBorderBoxCenter: withDroppableDisplacement(droppable, newCenter),
    impact: newImpact
  };
});

var moveToNewDroppable = (function (_ref) {
  var pageBorderBoxCenter = _ref.pageBorderBoxCenter,
      destination = _ref.destination,
      draggable = _ref.draggable,
      target = _ref.target,
      home = _ref.home,
      insideDestination = _ref.insideDestination,
      previousImpact = _ref.previousImpact,
      viewport = _ref.viewport;

  var amount = patch(destination.axis.line, draggable.client.marginBox[destination.axis.size]);

  if (destination.descriptor.id === draggable.descriptor.droppableId) {
    return toHomeList({
      amount: amount,
      originalIndex: home.index,
      target: target,
      insideDroppable: insideDestination,
      draggable: draggable,
      droppable: destination,
      previousImpact: previousImpact,
      viewport: viewport
    });
  }

  return toForeignList({
    amount: amount,
    pageBorderBoxCenter: pageBorderBoxCenter,
    target: target,
    insideDroppable: insideDestination,
    draggable: draggable,
    droppable: destination,
    previousImpact: previousImpact,
    viewport: viewport
  });
});

var moveCrossAxis = (function (_ref) {
  var isMovingForward = _ref.isMovingForward,
      pageBorderBoxCenter = _ref.pageBorderBoxCenter,
      draggableId = _ref.draggableId,
      droppableId = _ref.droppableId,
      home = _ref.home,
      draggables = _ref.draggables,
      droppables = _ref.droppables,
      previousImpact = _ref.previousImpact,
      viewport = _ref.viewport;

  var draggable = draggables[draggableId];
  var source = droppables[droppableId];

  var destination = getBestCrossAxisDroppable({
    isMovingForward: isMovingForward,
    pageBorderBoxCenter: pageBorderBoxCenter,
    source: source,
    droppables: droppables,
    viewport: viewport
  });

  if (!destination) {
    return null;
  }

  var insideDestination = getDraggablesInsideDroppable(destination, draggables);

  var target = getClosestDraggable({
    axis: destination.axis,
    pageBorderBoxCenter: pageBorderBoxCenter,
    destination: destination,
    insideDestination: insideDestination,
    viewport: viewport
  });

  if (insideDestination.length && !target) {
    return null;
  }

  return moveToNewDroppable({
    pageBorderBoxCenter: pageBorderBoxCenter,
    destination: destination,
    draggable: draggable,
    target: target,
    insideDestination: insideDestination,
    home: home,
    previousImpact: previousImpact || noImpact,
    viewport: viewport
  });
});

var noDimensions = {
  request: null,
  draggable: {},
  droppable: {}
};

var origin$3 = { x: 0, y: 0 };

var clean = memoizeOne(function () {
  var phase = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'IDLE';
  return {
    phase: phase,
    drag: null,
    drop: null,
    dimension: noDimensions
  };
});

var canPublishDimension = function canPublishDimension(phase) {
  return ['IDLE', 'DROP_ANIMATING', 'DROP_COMPLETE'].indexOf(phase) === -1;
};

var move = function move(_ref) {
  var state = _ref.state,
      clientSelection = _ref.clientSelection,
      shouldAnimate = _ref.shouldAnimate,
      proposedViewport = _ref.viewport,
      impact = _ref.impact,
      scrollJumpRequest = _ref.scrollJumpRequest;

  if (state.phase !== 'DRAGGING') {
    console.error('cannot move while not dragging');
    return clean();
  }

  var last = state.drag;

  if (last == null) {
    console.error('cannot move if there is no drag information');
    return clean();
  }

  var previous = last.current;
  var initial = last.initial;
  var viewport = proposedViewport || previous.viewport;
  var currentWindowScroll = viewport.scroll;

  var client = function () {
    var offset = subtract(clientSelection, initial.client.selection);

    var result = {
      offset: offset,
      selection: clientSelection,
      borderBoxCenter: add(offset, initial.client.borderBoxCenter)
    };
    return result;
  }();

  var page = {
    selection: add(client.selection, currentWindowScroll),
    offset: add(client.offset, currentWindowScroll),
    borderBoxCenter: add(client.borderBoxCenter, currentWindowScroll)
  };

  var current = {
    client: client,
    page: page,
    shouldAnimate: shouldAnimate,
    viewport: viewport,
    hasCompletedFirstBulkPublish: previous.hasCompletedFirstBulkPublish
  };

  var newImpact = impact || getDragImpact({
    pageBorderBoxCenter: page.borderBoxCenter,
    draggable: state.dimension.draggable[initial.descriptor.id],
    draggables: state.dimension.draggable,
    droppables: state.dimension.droppable,
    previousImpact: last.impact,
    viewport: viewport
  });

  var drag = {
    initial: initial,
    impact: newImpact,
    current: current,
    scrollJumpRequest: scrollJumpRequest
  };

  return _extends({}, state, {
    drag: drag
  });
};

var updateStateAfterDimensionChange = function updateStateAfterDimensionChange(newState, impact) {
  if (newState.phase === 'COLLECTING_INITIAL_DIMENSIONS') {
    return newState;
  }

  if (newState.phase !== 'DRAGGING') {
    return newState;
  }

  if (!newState.drag) {
    console.error('cannot update a draggable dimension in an existing drag as there is invalid drag state');
    return clean();
  }

  return move({
    state: newState,

    clientSelection: newState.drag.current.client.selection,
    shouldAnimate: newState.drag.current.shouldAnimate,
    impact: impact
  });
};

var reducer = (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : clean('IDLE');
  var action = arguments[1];

  if (action.type === 'CLEAN') {
    return clean();
  }

  if (action.type === 'PREPARE') {
    return clean('PREPARING');
  }

  if (action.type === 'REQUEST_DIMENSIONS') {
    if (state.phase !== 'PREPARING') {
      console.error('trying to start a lift while not preparing for a lift');
      return clean();
    }

    var request = action.payload;

    return {
      phase: 'COLLECTING_INITIAL_DIMENSIONS',
      drag: null,
      drop: null,
      dimension: {
        request: request,
        draggable: {},
        droppable: {}
      }
    };
  }

  if (action.type === 'PUBLISH_DRAGGABLE_DIMENSION') {
    var _extends2;

    var dimension = action.payload;

    if (!canPublishDimension(state.phase)) {
      console.warn('dimensions rejected as no longer allowing dimension capture in phase', state.phase);
      return state;
    }

    var newState = _extends({}, state, {
      dimension: {
        request: state.dimension.request,
        droppable: state.dimension.droppable,
        draggable: _extends({}, state.dimension.draggable, (_extends2 = {}, _extends2[dimension.descriptor.id] = dimension, _extends2))
      }
    });

    return updateStateAfterDimensionChange(newState);
  }

  if (action.type === 'PUBLISH_DROPPABLE_DIMENSION') {
    var _extends3;

    var _dimension = action.payload;

    if (!canPublishDimension(state.phase)) {
      console.warn('dimensions rejected as no longer allowing dimension capture in phase', state.phase);
      return state;
    }

    var _newState = _extends({}, state, {
      dimension: {
        request: state.dimension.request,
        draggable: state.dimension.draggable,
        droppable: _extends({}, state.dimension.droppable, (_extends3 = {}, _extends3[_dimension.descriptor.id] = _dimension, _extends3))
      }
    });

    return updateStateAfterDimensionChange(_newState);
  }

  if (action.type === 'BULK_DIMENSION_PUBLISH') {
    var draggables = action.payload.draggables;
    var droppables = action.payload.droppables;

    if (!canPublishDimension(state.phase)) {
      console.warn('dimensions rejected as no longer allowing dimension capture in phase', state.phase);
      return state;
    }

    var newDraggables = draggables.reduce(function (previous, current) {
      previous[current.descriptor.id] = current;
      return previous;
    }, {});

    var newDroppables = droppables.reduce(function (previous, current) {
      previous[current.descriptor.id] = current;
      return previous;
    }, {});

    var drag = function () {
      var existing = state.drag;
      if (!existing) {
        return null;
      }

      if (existing.current.hasCompletedFirstBulkPublish) {
        return existing;
      }

      var newDrag = _extends({}, existing, {
        current: _extends({}, existing.current, {
          hasCompletedFirstBulkPublish: true
        })
      });

      return newDrag;
    }();

    var _newState2 = _extends({}, state, {
      drag: drag,
      dimension: {
        request: state.dimension.request,
        draggable: _extends({}, state.dimension.draggable, newDraggables),
        droppable: _extends({}, state.dimension.droppable, newDroppables)
      }
    });

    return updateStateAfterDimensionChange(_newState2);
  }

  if (action.type === 'COMPLETE_LIFT') {
    if (state.phase !== 'COLLECTING_INITIAL_DIMENSIONS') {
      console.error('trying complete lift without collecting dimensions');
      return state;
    }

    var _action$payload = action.payload,
        id = _action$payload.id,
        client = _action$payload.client,
        _viewport = _action$payload.viewport,
        autoScrollMode = _action$payload.autoScrollMode;

    var page = {
      selection: add(client.selection, _viewport.scroll),
      borderBoxCenter: add(client.borderBoxCenter, _viewport.scroll)
    };

    var draggable = state.dimension.draggable[id];

    if (!draggable) {
      console.error('could not find draggable in store after lift');
      return clean();
    }

    var descriptor = draggable.descriptor;

    var initial = {
      descriptor: descriptor,
      autoScrollMode: autoScrollMode,
      client: client,
      page: page,
      viewport: _viewport
    };

    var current = {
      client: {
        selection: client.selection,
        borderBoxCenter: client.borderBoxCenter,
        offset: origin$3
      },
      page: {
        selection: page.selection,
        borderBoxCenter: page.borderBoxCenter,
        offset: origin$3
      },
      viewport: _viewport,
      hasCompletedFirstBulkPublish: false,
      shouldAnimate: false
    };

    var home = state.dimension.droppable[descriptor.droppableId];

    if (!home) {
      console.error('Cannot find home dimension for initial lift');
      return clean();
    }

    var destination = {
      index: descriptor.index,
      droppableId: descriptor.droppableId
    };

    var _impact = {
      movement: noMovement,
      direction: home.axis.direction,
      destination: destination
    };

    return _extends({}, state, {
      phase: 'DRAGGING',
      drag: {
        initial: initial,
        current: current,
        impact: _impact,
        scrollJumpRequest: null
      }
    });
  }

  if (action.type === 'UPDATE_DROPPABLE_DIMENSION_SCROLL') {
    var _extends4;

    if (state.phase !== 'DRAGGING') {
      console.error('cannot update a droppable dimensions scroll when not dragging');
      return clean();
    }

    var _drag = state.drag;

    if (_drag == null) {
      console.error('invalid store state');
      return clean();
    }

    var _action$payload2 = action.payload,
        _id = _action$payload2.id,
        offset = _action$payload2.offset;


    var target = state.dimension.droppable[_id];

    if (!target) {
      console.warn('cannot update scroll for droppable as it has not yet been collected');
      return state;
    }

    var _dimension2 = scrollDroppable(target, offset);

    var _impact2 = _drag.initial.autoScrollMode === 'JUMP' ? _drag.impact : null;

    var _newState3 = _extends({}, state, {
      dimension: {
        request: state.dimension.request,
        draggable: state.dimension.draggable,
        droppable: _extends({}, state.dimension.droppable, (_extends4 = {}, _extends4[_id] = _dimension2, _extends4))
      }
    });

    return updateStateAfterDimensionChange(_newState3, _impact2);
  }

  if (action.type === 'UPDATE_DROPPABLE_DIMENSION_IS_ENABLED') {
    var _extends5;

    if (!_Object$keys(state.dimension.droppable).length) {
      return state;
    }

    var _action$payload3 = action.payload,
        _id2 = _action$payload3.id,
        isEnabled = _action$payload3.isEnabled;

    var _target = state.dimension.droppable[_id2];

    if (!_target) {
      return state;
    }

    if (_target.isEnabled === isEnabled) {
      console.warn('Trying to set droppable isEnabled to ' + String(isEnabled) + ' but it is already ' + String(isEnabled));
      return state;
    }

    var updatedDroppableDimension = _extends({}, _target, {
      isEnabled: isEnabled
    });

    var result = _extends({}, state, {
      dimension: _extends({}, state.dimension, {
        droppable: _extends({}, state.dimension.droppable, (_extends5 = {}, _extends5[_id2] = updatedDroppableDimension, _extends5))
      })
    });

    return updateStateAfterDimensionChange(result);
  }

  if (action.type === 'MOVE') {
    var _action$payload4 = action.payload,
        _client = _action$payload4.client,
        _viewport2 = _action$payload4.viewport,
        _shouldAnimate = _action$payload4.shouldAnimate;

    var _drag2 = state.drag;

    if (!_drag2) {
      console.error('Cannot move while there is no drag state');
      return state;
    }

    var _impact3 = function () {
      if (!_drag2.current.hasCompletedFirstBulkPublish) {
        return _drag2.impact;
      }

      if (_drag2.initial.autoScrollMode === 'JUMP') {
        return _drag2.impact;
      }

      return null;
    }();

    return move({
      state: state,
      clientSelection: _client,
      viewport: _viewport2,
      shouldAnimate: _shouldAnimate,
      impact: _impact3
    });
  }

  if (action.type === 'MOVE_BY_WINDOW_SCROLL') {
    var _viewport3 = action.payload.viewport;

    var _drag3 = state.drag;

    if (!_drag3) {
      console.error('cannot move with window scrolling if no current drag');
      return clean();
    }

    if (isEqual(_viewport3.scroll, _drag3.current.viewport.scroll)) {
      return state;
    }

    var isJumpScrolling = _drag3.initial.autoScrollMode === 'JUMP';

    var _impact4 = isJumpScrolling ? _drag3.impact : null;

    return move({
      state: state,
      clientSelection: _drag3.current.client.selection,
      viewport: _viewport3,
      shouldAnimate: false,
      impact: _impact4
    });
  }

  if (action.type === 'MOVE_FORWARD' || action.type === 'MOVE_BACKWARD') {
    if (state.phase !== 'DRAGGING') {
      console.error('cannot move while not dragging', action);
      return clean();
    }

    if (!state.drag) {
      console.error('cannot move if there is no drag information');
      return clean();
    }

    var existing = state.drag;
    var isMovingForward = action.type === 'MOVE_FORWARD';

    if (!existing.impact.destination) {
      return state;
    }

    var droppable = state.dimension.droppable[existing.impact.destination.droppableId];

    var _result = moveToNextIndex({
      isMovingForward: isMovingForward,
      draggableId: existing.initial.descriptor.id,
      droppable: droppable,
      draggables: state.dimension.draggable,
      previousPageBorderBoxCenter: existing.current.page.borderBoxCenter,
      previousImpact: existing.impact,
      viewport: existing.current.viewport
    });

    if (!_result) {
      return state;
    }

    var _impact5 = _result.impact;
    var pageBorderBoxCenter = _result.pageBorderBoxCenter;
    var clientBorderBoxCenter = subtract(pageBorderBoxCenter, existing.current.viewport.scroll);

    return move({
      state: state,
      impact: _impact5,
      clientSelection: clientBorderBoxCenter,
      shouldAnimate: true,
      scrollJumpRequest: _result.scrollJumpRequest
    });
  }

  if (action.type === 'CROSS_AXIS_MOVE_FORWARD' || action.type === 'CROSS_AXIS_MOVE_BACKWARD') {
    if (state.phase !== 'DRAGGING') {
      console.error('cannot move cross axis when not dragging');
      return clean();
    }

    var _drag4 = state.drag;
    if (!_drag4) {
      console.error('cannot move cross axis if there is no drag information');
      return clean();
    }

    var droppableId = function () {
      if (_drag4.impact.destination) {
        return _drag4.impact.destination.droppableId;
      }

      return _drag4.initial.descriptor.droppableId;
    }();

    var _current = _drag4.current;
    var _descriptor = _drag4.initial.descriptor;
    var draggableId = _descriptor.id;
    var _pageBorderBoxCenter = _current.page.borderBoxCenter;
    var _home = {
      index: _descriptor.index,
      droppableId: _descriptor.droppableId
    };

    var _result2 = moveCrossAxis({
      isMovingForward: action.type === 'CROSS_AXIS_MOVE_FORWARD',
      pageBorderBoxCenter: _pageBorderBoxCenter,
      draggableId: draggableId,
      droppableId: droppableId,
      home: _home,
      draggables: state.dimension.draggable,
      droppables: state.dimension.droppable,
      previousImpact: _drag4.impact,
      viewport: _current.viewport
    });

    if (!_result2) {
      return state;
    }

    var _page = _result2.pageBorderBoxCenter;
    var _client2 = subtract(_page, _current.viewport.scroll);

    return move({
      state: state,
      clientSelection: _client2,
      impact: _result2.impact,
      shouldAnimate: true
    });
  }

  if (action.type === 'DROP_ANIMATE') {
    var _action$payload5 = action.payload,
        newHomeOffset = _action$payload5.newHomeOffset,
        _impact6 = _action$payload5.impact,
        _result3 = _action$payload5.result;


    if (state.phase !== 'DRAGGING') {
      console.error('cannot animate drop while not dragging', action);
      return state;
    }

    if (!state.drag) {
      console.error('cannot animate drop - invalid drag state');
      return clean();
    }

    var pending = {
      newHomeOffset: newHomeOffset,
      result: _result3,
      impact: _impact6
    };

    return {
      phase: 'DROP_ANIMATING',
      drag: null,
      drop: {
        pending: pending,
        result: null
      },
      dimension: state.dimension
    };
  }

  if (action.type === 'DROP_COMPLETE') {
    var _result4 = action.payload;

    return {
      phase: 'DROP_COMPLETE',
      drag: null,
      drop: {
        pending: null,
        result: _result4
      },
      dimension: noDimensions
    };
  }

  return state;
});

var composeEnhancers = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

var createStore$1 = (function () {
  return createStore(reducer, composeEnhancers(applyMiddleware(thunk)));
});

var onDragStart = function onDragStart(start) {
  return '\n  You have lifted an item in position ' + (start.source.index + 1) + '.\n  Use the arrow keys to move, space bar to drop, and escape to cancel.\n';
};

var onDragUpdate = function onDragUpdate(update) {
  if (!update.destination) {
    return 'You are currently not dragging over a droppable area';
  }

  if (update.source.droppableId === update.destination.droppableId) {
    return 'You have moved the item to position ' + (update.destination.index + 1);
  }

  return '\n    You have moved the item from list ' + update.source.droppableId + ' in position ' + (update.source.index + 1) + '\n    to list ' + update.destination.droppableId + ' in position ' + (update.destination.index + 1) + '\n  ';
};

var onDragEnd = function onDragEnd(result) {
  if (result.reason === 'CANCEL') {
    return '\n      Movement cancelled.\n      The item has returned to its starting position of ' + (result.source.index + 1) + '\n    ';
  }

  if (!result.destination) {
    return '\n      The item has been dropped while not over a droppable location.\n      The item has returned to its starting position of ' + (result.source.index + 1) + '\n    ';
  }

  if (result.source.droppableId === result.destination.droppableId) {
    if (result.source.index === result.destination.index) {
      return '\n        You have dropped the item.\n        It has been dropped on its starting position of ' + (result.source.index + 1) + '\n      ';
    }

    return '\n      You have dropped the item.\n      It has moved from position ' + (result.source.index + 1) + ' to ' + (result.destination.index + 1) + '\n    ';
  }

  return '\n    You have dropped the item.\n    It has moved from position ' + (result.source.index + 1) + ' in list ' + result.source.droppableId + '\n    to position ' + (result.destination.index + 1) + ' in list ' + result.destination.droppableId + '\n  ';
};

var preset = {
  onDragStart: onDragStart, onDragUpdate: onDragUpdate, onDragEnd: onDragEnd
};

var records = {};

var flag = '__react-beautiful-dnd-debug-timings-hook__';

var isTimingsEnabled = function isTimingsEnabled() {
  return Boolean(window[flag]);
};

var start = function start(key) {
  if (!isTimingsEnabled()) {
    return;
  }
  var now = performance.now();

  records[key] = now;
};

var finish = function finish(key) {
  if (!isTimingsEnabled()) {
    return;
  }
  var now = performance.now();

  var previous = records[key];

  if (previous == null) {
    console.error('cannot finish timing as no previous time found');
    return;
  }

  var result = now - previous;
  var rounded = result.toFixed(2);

  var style = function () {
    if (result < 16) {
      return {
        textColor: 'green',
        symbol: '✅'
      };
    }
    if (result < 40) {
      return {
        textColor: 'orange',
        symbol: '⚠️'
      };
    }
    return {
      textColor: 'red',
      symbol: '❌'
    };
  }();

  console.log(style.symbol + ' %cTiming %c' + rounded + ' %cms %c' + key, 'color: blue; font-weight: bold; ', 'color: ' + style.textColor + '; font-size: 1.1em;', 'color: grey;', 'color: purple; font-weight: bold;');
};

var withTimings = function withTimings(key, fn) {
  start(key);
  fn();
  finish(key);
};

var notDragging = {
  isDragging: false,
  start: null,
  lastDestination: null,
  hasMovedFromStartLocation: false
};

var areLocationsEqual = function areLocationsEqual(current, next) {
  if (current == null && next == null) {
    return true;
  }

  if (current == null || next == null) {
    return false;
  }

  return current.droppableId === next.droppableId && current.index === next.index;
};

var getAnnouncerForConsumer = function getAnnouncerForConsumer(announce) {
  var wasCalled = false;
  var isExpired = false;

  setTimeout(function () {
    isExpired = true;
  });

  var result = function result(message) {
    if (wasCalled) {
      console.warn('Announcement already made. Not making a second announcement');
      return;
    }

    if (isExpired) {
      console.warn('\n        Announcements cannot be made asynchronously.\n        Default message has already been announced.\n      ');
      return;
    }

    wasCalled = true;
    announce(message);
  };

  result.wasCalled = function () {
    return wasCalled;
  };

  return result;
};

var createHookCaller = (function (announce) {
  var state = notDragging;

  var setState = function setState(partial) {
    var newState = _extends({}, state, partial);
    state = newState;
  };

  var getDragStart = function getDragStart(appState) {
    if (!appState.drag) {
      return null;
    }

    var descriptor = appState.drag.initial.descriptor;
    var home = appState.dimension.droppable[descriptor.droppableId];

    if (!home) {
      return null;
    }

    var source = {
      index: descriptor.index,
      droppableId: descriptor.droppableId
    };

    var start$$1 = {
      draggableId: descriptor.id,
      type: home.descriptor.type,
      source: source
    };

    return start$$1;
  };

  var execute = function execute(hook, data, getDefaultMessage) {
    if (!hook) {
      announce(getDefaultMessage(data));
      return;
    }

    var managed = getAnnouncerForConsumer(announce);
    var provided = {
      announce: managed
    };

    hook(data, provided);

    if (!managed.wasCalled()) {
      announce(getDefaultMessage(data));
    }
  };

  var onDrag = function onDrag(current, onDragUpdate) {
    if (!state.isDragging) {
      console.error('Cannot process dragging update if drag has not started');
      return;
    }

    var drag = current.drag;
    var start$$1 = getDragStart(current);
    if (!start$$1 || !drag) {
      console.error('Cannot update drag when there is invalid state');
      return;
    }

    var destination = drag.impact.destination;
    var update = {
      draggableId: start$$1.draggableId,
      type: start$$1.type,
      source: start$$1.source,
      destination: destination
    };

    if (!state.hasMovedFromStartLocation) {
      if (areLocationsEqual(start$$1.source, destination)) {
        return;
      }

      setState({
        lastDestination: destination,
        hasMovedFromStartLocation: true
      });

      execute(onDragUpdate, update, preset.onDragUpdate);

      return;
    }

    if (areLocationsEqual(state.lastDestination, destination)) {
      return;
    }

    setState({
      lastDestination: destination
    });

    execute(onDragUpdate, update, preset.onDragUpdate);
  };

  var onStateChange = function onStateChange(hooks, previous, current) {
    var onDragStart = hooks.onDragStart,
        onDragUpdate = hooks.onDragUpdate,
        onDragEnd = hooks.onDragEnd;

    var currentPhase = current.phase;
    var previousPhase = previous.phase;

    if (currentPhase === 'DRAGGING' && previousPhase === 'DRAGGING') {
      onDrag(current, onDragUpdate);
      return;
    }

    if (state.isDragging) {
      setState(notDragging);
    }

    if (currentPhase === previousPhase) {
      return;
    }

    if (currentPhase === 'DRAGGING' && previousPhase !== 'DRAGGING') {
      var _start = getDragStart(current);

      if (!_start) {
        console.error('Unable to publish onDragStart');
        return;
      }

      setState({
        isDragging: true,
        hasMovedFromStartLocation: false,
        start: _start
      });

      withTimings('hook:onDragStart', function () {
        return execute(onDragStart, _start, preset.onDragStart);
      });
      return;
    }

    if (currentPhase === 'DROP_COMPLETE' && previousPhase !== 'DROP_COMPLETE') {
      if (!current.drop || !current.drop.result) {
        console.error('cannot fire onDragEnd hook without drag state', { current: current, previous: previous });
        return;
      }
      var result = current.drop.result;

      withTimings('hook:onDragEnd', function () {
        return execute(onDragEnd, result, preset.onDragEnd);
      });
      return;
    }

    if (currentPhase === 'IDLE' && previousPhase === 'DRAGGING') {
      if (!previous.drag) {
        console.error('cannot fire onDragEnd for cancel because cannot find previous drag');
        return;
      }

      var descriptor = previous.drag.initial.descriptor;
      var home = previous.dimension.droppable[descriptor.droppableId];

      if (!home) {
        console.error('cannot find dimension for home droppable');
        return;
      }

      var source = {
        index: descriptor.index,
        droppableId: descriptor.droppableId
      };
      var _result = {
        draggableId: descriptor.id,
        type: home.descriptor.type,
        source: source,
        destination: null,
        reason: 'CANCEL'
      };

      withTimings('hook:onDragEnd (cancel)', function () {
        return execute(onDragEnd, _result, preset.onDragEnd);
      });
      return;
    }

    if (currentPhase === 'IDLE' && previousPhase === 'DROP_ANIMATING') {
      if (!previous.drop || !previous.drop.pending) {
        console.error('cannot fire onDragEnd for cancel because cannot find previous pending drop');
        return;
      }

      var _result2 = {
        draggableId: previous.drop.pending.result.draggableId,
        type: previous.drop.pending.result.type,
        source: previous.drop.pending.result.source,
        destination: null,
        reason: 'CANCEL'
      };

      execute(onDragEnd, _result2, preset.onDragEnd);
    }
  };

  var caller = {
    onStateChange: onStateChange
  };

  return caller;
});

var createDimensionMarshal = (function (callbacks) {
  var state = {
    droppables: {},
    draggables: {},
    isCollecting: false,
    scrollOptions: null,
    request: null,
    requestType: null,
    frameId: null
  };

  var setState = function setState(partial) {
    var newState = _extends({}, state, partial);
    state = newState;
  };

  var cancel = function cancel() {
    var _console;

    (_console = console).error.apply(_console, arguments);

    callbacks.cancel();

    if (!state.isCollecting) {
      return;
    }

    stopCollecting();
  };

  var cancelIfModifyingActiveDraggable = function cancelIfModifyingActiveDraggable(descriptor) {
    if (!state.isCollecting) {
      return;
    }

    var home = state.droppables[descriptor.droppableId];

    if (!home) {
      return;
    }

    if (home.descriptor.type !== state.requestType) {
      return;
    }

    cancel('Adding or removing a Draggable during a drag is currently not supported');
  };

  var cancelIfModifyingActiveDroppable = function cancelIfModifyingActiveDroppable(descriptor) {
    if (!state.isCollecting) {
      return;
    }

    if (descriptor.type !== state.requestType) {
      return;
    }

    cancel('Adding or removing a Droppable during a drag is currently not supported');
  };

  var registerDraggable = function registerDraggable(descriptor, getDimension) {
    var _extends2;

    var id = descriptor.id;

    var entry = {
      descriptor: descriptor,
      getDimension: getDimension
    };
    var draggables = _extends({}, state.draggables, (_extends2 = {}, _extends2[id] = entry, _extends2));

    setState({
      draggables: draggables
    });

    cancelIfModifyingActiveDraggable(descriptor);
  };

  var registerDroppable = function registerDroppable(descriptor, droppableCallbacks) {
    var _extends3;

    var id = descriptor.id;

    var entry = {
      descriptor: descriptor,
      callbacks: droppableCallbacks
    };

    var droppables = _extends({}, state.droppables, (_extends3 = {}, _extends3[id] = entry, _extends3));

    setState({
      droppables: droppables
    });

    cancelIfModifyingActiveDroppable(descriptor);
  };

  var updateDroppableIsEnabled = function updateDroppableIsEnabled(id, isEnabled) {
    if (!state.droppables[id]) {
      cancel('Cannot update the scroll on Droppable ' + id + ' as it is not registered');
      return;
    }

    if (!state.isCollecting) {
      return;
    }

    callbacks.updateDroppableIsEnabled(id, isEnabled);
  };

  var updateDroppableScroll = function updateDroppableScroll(id, newScroll) {
    if (!state.droppables[id]) {
      cancel('Cannot update the scroll on Droppable ' + id + ' as it is not registered');
      return;
    }

    if (!state.isCollecting) {
      return;
    }
    callbacks.updateDroppableScroll(id, newScroll);
  };

  var scrollDroppable = function scrollDroppable(id, change) {
    var entry = state.droppables[id];
    if (!entry) {
      return;
    }

    if (!state.isCollecting) {
      return;
    }

    entry.callbacks.scroll(change);
  };

  var unregisterDraggable = function unregisterDraggable(descriptor) {
    var entry = state.draggables[descriptor.id];

    if (!entry) {
      cancel('Cannot unregister Draggable with id ' + descriptor.id + ' as it is not registered');
      return;
    }

    if (entry.descriptor !== descriptor) {
      return;
    }

    var newMap = _extends({}, state.draggables);
    delete newMap[descriptor.id];

    setState({
      draggables: newMap
    });

    cancelIfModifyingActiveDraggable(descriptor);
  };

  var unregisterDroppable = function unregisterDroppable(descriptor) {
    var entry = state.droppables[descriptor.id];

    if (!entry) {
      cancel('Cannot unregister Droppable with id ' + descriptor.id + ' as as it is not registered');
      return;
    }

    if (entry.descriptor !== descriptor) {
      return;
    }

    var newMap = _extends({}, state.droppables);
    delete newMap[descriptor.id];

    setState({
      droppables: newMap
    });

    cancelIfModifyingActiveDroppable(descriptor);
  };

  var getToBeCollected = function getToBeCollected() {
    var draggables = state.draggables;
    var droppables = state.droppables;
    var request = state.request;

    if (!request) {
      console.error('cannot find request in state');
      return [];
    }
    var draggableId = request.draggableId;
    var descriptor = draggables[draggableId].descriptor;
    var home = droppables[descriptor.droppableId].descriptor;

    var draggablesToBeCollected = _Object$keys(draggables).map(function (id) {
      return draggables[id].descriptor;
    }).filter(function (item) {
      return item.id !== descriptor.id;
    }).filter(function (item) {
      var entry = droppables[item.droppableId];

      if (!entry) {
        console.warn('Orphan Draggable found ' + item.id + ' which says it belongs to unknown Droppable ' + item.droppableId);
        return false;
      }

      return entry.descriptor.type === home.type;
    });

    var droppablesToBeCollected = _Object$keys(droppables).map(function (id) {
      return droppables[id].descriptor;
    }).filter(function (item) {
      return item.id !== home.id;
    }).filter(function (item) {
      var droppable = droppables[item.id].descriptor;
      return droppable.type === home.type;
    });

    var toBeCollected = [].concat(droppablesToBeCollected, draggablesToBeCollected);

    return toBeCollected;
  };

  var processPrimaryDimensions = function processPrimaryDimensions(request) {
    if (state.isCollecting) {
      cancel('Cannot start capturing dimensions for a drag it is already dragging');
      return;
    }

    if (!request) {
      cancel('Cannot start capturing dimensions with an invalid request', request);
      return;
    }

    var draggables = state.draggables;
    var droppables = state.droppables;
    var draggableId = request.draggableId;
    var draggableEntry = draggables[draggableId];

    if (!draggableEntry) {
      cancel('Cannot find Draggable with id ' + draggableId + ' to start collecting dimensions');
      return;
    }

    var homeEntry = droppables[draggableEntry.descriptor.droppableId];

    if (!homeEntry) {
      cancel('\n        Cannot find home Droppable [id:' + draggableEntry.descriptor.droppableId + ']\n        for Draggable [id:' + request.draggableId + ']\n      ');
      return;
    }

    setState({
      isCollecting: true,
      request: request,
      requestType: homeEntry.descriptor.type
    });

    var home = homeEntry.callbacks.getDimension();
    var draggable = draggableEntry.getDimension();

    callbacks.publishDroppable(home);
    callbacks.publishDraggable(draggable);

    homeEntry.callbacks.watchScroll(request.scrollOptions);
  };

  var setFrameId = function setFrameId(frameId) {
    setState({
      frameId: frameId
    });
  };

  var processSecondaryDimensions = function processSecondaryDimensions(requestInAppState) {
    if (!state.isCollecting) {
      cancel('Cannot collect secondary dimensions when collection is not occurring');
      return;
    }

    var request = state.request;

    if (!request) {
      cancel('Cannot process secondary dimensions without a request');
      return;
    }

    if (!requestInAppState) {
      cancel('Cannot process secondary dimensions without a request on the state');
      return;
    }

    if (requestInAppState.draggableId !== request.draggableId) {
      cancel('Cannot process secondary dimensions as local request does not match app state');
      return;
    }

    var toBeCollected = getToBeCollected();

    var collectFrameId = requestAnimationFrame(function () {
      var toBePublishedBuffer = toBeCollected.map(function (descriptor) {
        if (descriptor.type) {
          return state.droppables[descriptor.id].callbacks.getDimension();
        }

        return state.draggables[descriptor.id].getDimension();
      });

      var publishFrameId = requestAnimationFrame(function () {
        var toBePublished = toBePublishedBuffer.reduce(function (previous, dimension) {
          if (dimension.placeholder) {
            previous.draggables.push(dimension);
          } else {
            previous.droppables.push(dimension);
          }
          return previous;
        }, { draggables: [], droppables: [] });

        callbacks.bulkPublish(toBePublished.droppables, toBePublished.draggables);

        toBePublished.droppables.forEach(function (dimension) {
          var entry = state.droppables[dimension.descriptor.id];
          entry.callbacks.watchScroll(request.scrollOptions);
        });

        setFrameId(null);
      });

      setFrameId(publishFrameId);
    });

    setFrameId(collectFrameId);
  };

  var stopCollecting = function stopCollecting() {
    _Object$keys(state.droppables).forEach(function (id) {
      return state.droppables[id].callbacks.unwatchScroll();
    });

    if (state.frameId) {
      cancelAnimationFrame(state.frameId);
    }

    setState({
      isCollecting: false,
      request: null,
      frameId: null
    });
  };

  var onPhaseChange = function onPhaseChange(current) {
    var phase = current.phase;

    if (phase === 'COLLECTING_INITIAL_DIMENSIONS') {
      processPrimaryDimensions(current.dimension.request);
      return;
    }

    if (phase === 'DRAGGING') {
      processSecondaryDimensions(current.dimension.request);
      return;
    }

    if (phase === 'DROP_ANIMATING' || phase === 'DROP_COMPLETE') {
      if (state.isCollecting) {
        stopCollecting();
      }
      return;
    }

    if (phase === 'IDLE') {
      if (state.isCollecting) {
        stopCollecting();
      }
    }
  };

  var marshal = {
    registerDraggable: registerDraggable,
    unregisterDraggable: unregisterDraggable,
    registerDroppable: registerDroppable,
    unregisterDroppable: unregisterDroppable,
    updateDroppableIsEnabled: updateDroppableIsEnabled,
    scrollDroppable: scrollDroppable,
    updateDroppableScroll: updateDroppableScroll,
    onPhaseChange: onPhaseChange
  };

  return marshal;
});

var physics = function () {
  var base = {
    stiffness: 1000,
    damping: 60,

    precision: 0.99
  };

  var standard = _extends({}, base);

  var fast = _extends({}, base, {
    stiffness: base.stiffness * 2
  });

  return { standard: standard, fast: fast };
}();

var css = {
  outOfTheWay: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)'
};

var prefix = 'data-react-beautiful-dnd';
var dragHandle = prefix + '-drag-handle';
var draggable = prefix + '-draggable';
var droppable = prefix + '-droppable';

var getStyles = (function (styleContext) {
  var dragHandleSelector = '[' + dragHandle + '="' + styleContext + '"]';
  var draggableSelector = '[' + draggable + '="' + styleContext + '"]';
  var droppableSelector = '[' + droppable + '="' + styleContext + '"]';

  var dragHandleStyles = {
    base: '\n      ' + dragHandleSelector + ' {\n        -webkit-touch-callout: none;\n        -webkit-tap-highlight-color: rgba(0,0,0,0);\n        touch-action: manipulation;\n      }\n    ',
    grabCursor: '\n      ' + dragHandleSelector + ' {\n        cursor: -webkit-grab;\n        cursor: grab;\n      }\n    ',
    blockPointerEvents: '\n      ' + dragHandleSelector + ' {\n        pointer-events: none;\n      }\n    '
  };

  var draggableStyles = {
    animateMovement: '\n      ' + draggableSelector + ' {\n        transition: ' + css.outOfTheWay + ';\n      }\n    '
  };

  var droppableStyles = {
    base: '\n      ' + droppableSelector + ' {\n        overflow-anchor: none;\n      }\n    '
  };

  var bodyStyles = {
    whileActiveDragging: '\n      body {\n        cursor: grabbing;\n        cursor: -webkit-grabbing;\n        user-select: none;\n        -webkit-user-select: none;\n        -moz-user-select: none;\n        -ms-user-select: none;\n      }\n    '
  };

  var base = [dragHandleStyles.base, droppableStyles.base];

  var resting = [].concat(base, [dragHandleStyles.grabCursor]).join('');

  var dragging = [].concat(base, [dragHandleStyles.blockPointerEvents, draggableStyles.animateMovement, bodyStyles.whileActiveDragging]).join('');

  var dropAnimating = [].concat(base, [dragHandleStyles.grabCursor, draggableStyles.animateMovement]).join('');

  var userCancel = [].concat(base, [draggableStyles.animateMovement]).join('');

  return { resting: resting, dragging: dragging, dropAnimating: dropAnimating, userCancel: userCancel };
});

var count = 0;

var resetStyleContext = function resetStyleContext() {
  count = 0;
};

var createStyleMarshal = (function () {
  var context = '' + count++;
  var styles = getStyles(context);

  var state = {
    el: null
  };

  var setState = function setState(newState) {
    state = newState;
  };

  var setStyle = memoizeOne(function (proposed) {
    if (!state.el) {
      console.error('cannot set style of style tag if not mounted');
      return;
    }

    state.el.innerHTML = proposed;
  });

  var mount = function mount() {
    if (state.el) {
      console.error('Style marshal already mounted');
      return;
    }

    var el = document.createElement('style');
    el.type = 'text/css';

    el.setAttribute(prefix, context);
    var head = document.querySelector('head');

    invariant(head, 'Cannot find the head to append a style to');

    head.appendChild(el);
    setState({
      el: el
    });

    setStyle(styles.resting);
  };

  var onPhaseChange = function onPhaseChange(current) {
    if (!state.el) {
      console.error('cannot update styles until style marshal is mounted');
      return;
    }

    var phase = current.phase;

    if (phase === 'DRAGGING') {
      setStyle(styles.dragging);
      return;
    }

    if (phase === 'DROP_ANIMATING') {
      if (!current.drop || !current.drop.pending) {
        console.error('Invalid state found in style-marshal');
        return;
      }

      var reason = current.drop.pending.result.reason;

      if (reason === 'DROP') {
        setStyle(styles.dropAnimating);
        return;
      }
      setStyle(styles.userCancel);
      return;
    }

    setStyle(styles.resting);
  };

  var unmount = function unmount() {
    if (!state.el) {
      console.error('Cannot unmount style marshal as it is already unmounted');
      return;
    }
    var previous = state.el;

    setState({
      el: null
    });

    if (!previous.parentNode) {
      console.error('Cannot unmount style marshal as cannot find parent');
      return;
    }

    previous.parentNode.removeChild(previous);
  };

  var marshal = {
    onPhaseChange: onPhaseChange,
    styleContext: context,
    mount: mount,
    unmount: unmount
  };

  return marshal;
});

var canStartDrag = (function (state, id) {
  var phase = state.phase;

  if (phase === 'IDLE' || phase === 'DROP_COMPLETE') {
    return true;
  }

  if (phase === 'PREPARING' || phase === 'COLLECTING_INITIAL_DIMENSIONS' || phase === 'DRAGGING') {
    return false;
  }

  if (phase === 'DROP_ANIMATING') {
    if (!state.drop || !state.drop.pending) {
      console.error('Invalid state shape for drop animating');
      return false;
    }

    if (state.drop.pending.result.draggableId === id) {
      return false;
    }

    return state.drop.pending.result.reason === 'DROP';
  }

  console.warn('unhandled phase ' + phase + ' in canLift check');
  return false;
});

var scrollWindow = (function (change) {
  window.scrollBy(change.x, change.y);
});

var count$1 = 0;

var visuallyHidden = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  border: '0',
  padding: '0',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',

  'clip-path': 'inset(100%)'
};

var createAnnouncer = (function () {
  var id = 'react-beautiful-dnd-announcement-' + count$1++;

  var state = {
    el: null
  };

  var setState = function setState(newState) {
    state = newState;
  };

  var announce = function announce(message) {
    var el = state.el;
    if (!el) {
      console.error('Cannot announce to unmounted node');
      return;
    }

    el.textContent = message;
  };

  var mount = function mount() {
    if (state.el) {
      console.error('Announcer already mounted');
      return;
    }

    var el = document.createElement('div');

    el.id = id;

    el.setAttribute('aria-live', 'assertive');
    el.setAttribute('role', 'log');

    el.setAttribute('aria-atomic', 'true');

    _Object$assign(el.style, visuallyHidden);

    invariant(document.body, 'Cannot find the head to append a style to');

    document.body.appendChild(el);
    setState({
      el: el
    });
  };

  var unmount = function unmount() {
    if (!state.el) {
      console.error('Will not unmount annoucer as it is already unmounted');
      return;
    }
    var node = state.el;

    setState({
      el: null
    });

    if (!node.parentNode) {
      console.error('Cannot unmount style marshal as cannot find parent');
      return;
    }

    node.parentNode.removeChild(node);
  };

  var announcer = {
    announce: announce,
    id: id,
    mount: mount,
    unmount: unmount
  };

  return announcer;
});

var getScrollableDroppables = memoizeOne(function (droppables) {
  return _Object$keys(droppables).map(function (id) {
    return droppables[id];
  }).filter(function (droppable) {
    if (!droppable.isEnabled) {
      return false;
    }

    if (!droppable.viewport.closestScrollable) {
      return false;
    }

    return true;
  });
});

var getScrollableDroppableOver = function getScrollableDroppableOver(target, droppables) {
  var maybe = getScrollableDroppables(droppables).find(function (droppable) {
    invariant(droppable.viewport.closestScrollable, 'Invalid result');
    return isPositionInFrame(droppable.viewport.closestScrollable.framePageMarginBox)(target);
  });

  return maybe;
};

var getBestScrollableDroppable = (function (_ref) {
  var center = _ref.center,
      destination = _ref.destination,
      droppables = _ref.droppables;


  if (destination) {
    var _dimension = droppables[destination.droppableId];
    if (!_dimension.viewport.closestScrollable) {
      return null;
    }
    return _dimension;
  }

  var dimension = getScrollableDroppableOver(center, droppables);

  return dimension;
});

var origin$4 = { x: 0, y: 0 };

var smallestSigned = apply(function (value) {
  if (value === 0) {
    return 0;
  }
  return value > 0 ? 1 : -1;
});

var getOverlap = function () {
  var getRemainder = function getRemainder(target, max) {
    if (target < 0) {
      return target;
    }
    if (target > max) {
      return target - max;
    }
    return 0;
  };

  return function (_ref) {
    var current = _ref.current,
        max = _ref.max,
        change = _ref.change;

    var targetScroll = add(current, change);

    var overlap = {
      x: getRemainder(targetScroll.x, max.x),
      y: getRemainder(targetScroll.y, max.y)
    };

    if (isEqual(overlap, origin$4)) {
      return null;
    }

    return overlap;
  };
}();

var canPartiallyScroll = function canPartiallyScroll(_ref2) {
  var max = _ref2.max,
      current = _ref2.current,
      change = _ref2.change;

  var smallestChange = smallestSigned(change);

  var overlap = getOverlap({
    max: max, current: current, change: smallestChange
  });

  if (!overlap) {
    return true;
  }

  if (smallestChange.x !== 0 && overlap.x === 0) {
    return true;
  }

  if (smallestChange.y !== 0 && overlap.y === 0) {
    return true;
  }

  return false;
};

var canScrollWindow = function canScrollWindow(viewport, change) {
  return canPartiallyScroll({
    current: viewport.scroll,
    max: viewport.maxScroll,
    change: change
  });
};

var canScrollDroppable = function canScrollDroppable(droppable, change) {
  var closestScrollable = droppable.viewport.closestScrollable;

  if (!closestScrollable) {
    return false;
  }

  return canPartiallyScroll({
    current: closestScrollable.scroll.current,
    max: closestScrollable.scroll.max,
    change: change
  });
};

var getWindowOverlap = function getWindowOverlap(viewport, change) {
  if (!canScrollWindow(viewport, change)) {
    return null;
  }

  var max = viewport.maxScroll;
  var current = viewport.scroll;

  return getOverlap({
    current: current,
    max: max,
    change: change
  });
};

var getDroppableOverlap = function getDroppableOverlap(droppable, change) {
  if (!canScrollDroppable(droppable, change)) {
    return null;
  }

  var closestScrollable = droppable.viewport.closestScrollable;

  if (!closestScrollable) {
    return null;
  }

  return getOverlap({
    current: closestScrollable.scroll.current,
    max: closestScrollable.scroll.max,
    change: change
  });
};

var config = {
  startFrom: 0.25,
  maxSpeedAt: 0.05,

  maxScrollSpeed: 28,

  ease: function ease(percentage) {
    return Math.pow(percentage, 2);
  }
};

var origin$5 = { x: 0, y: 0 };

var clean$1 = apply(function (value) {
  return value === 0 ? 0 : value;
});

var getPixelThresholds = function getPixelThresholds(container, axis) {
  var startFrom = container[axis.size] * config.startFrom;
  var maxSpeedAt = container[axis.size] * config.maxSpeedAt;
  var accelerationPlane = startFrom - maxSpeedAt;

  var thresholds = {
    startFrom: startFrom,
    maxSpeedAt: maxSpeedAt,
    accelerationPlane: accelerationPlane
  };

  return thresholds;
};

var getSpeed = function getSpeed(distance$$1, thresholds) {
  if (distance$$1 >= thresholds.startFrom) {
    return 0;
  }

  if (distance$$1 <= thresholds.maxSpeedAt) {
    return config.maxScrollSpeed;
  }

  var distancePastStart = thresholds.startFrom - distance$$1;
  var percentage = distancePastStart / thresholds.accelerationPlane;
  var transformed = config.ease(percentage);

  var speed = config.maxScrollSpeed * transformed;

  return speed;
};

var adjustForSizeLimits = function adjustForSizeLimits(_ref) {
  var container = _ref.container,
      subject = _ref.subject,
      proposedScroll = _ref.proposedScroll;

  var isTooBigVertically = subject.height > container.height;
  var isTooBigHorizontally = subject.width > container.width;

  if (!isTooBigHorizontally && !isTooBigVertically) {
    return proposedScroll;
  }

  if (isTooBigHorizontally && isTooBigVertically) {
    return null;
  }

  return {
    x: isTooBigHorizontally ? 0 : proposedScroll.x,
    y: isTooBigVertically ? 0 : proposedScroll.y
  };
};

var getRequiredScroll = function getRequiredScroll(_ref2) {
  var container = _ref2.container,
      subject = _ref2.subject,
      center = _ref2.center;

  var distance$$1 = {
    top: center.y - container.top,
    right: container.right - center.x,
    bottom: container.bottom - center.y,
    left: center.x - container.left
  };

  var y = function () {
    var thresholds = getPixelThresholds(container, vertical);
    var isCloserToBottom = distance$$1.bottom < distance$$1.top;

    if (isCloserToBottom) {
      return getSpeed(distance$$1.bottom, thresholds);
    }

    return -1 * getSpeed(distance$$1.top, thresholds);
  }();

  var x = function () {
    var thresholds = getPixelThresholds(container, horizontal);
    var isCloserToRight = distance$$1.right < distance$$1.left;

    if (isCloserToRight) {
      return getSpeed(distance$$1.right, thresholds);
    }

    return -1 * getSpeed(distance$$1.left, thresholds);
  }();

  var required = clean$1({ x: x, y: y });

  if (isEqual(required, origin$5)) {
    return null;
  }

  var limited = adjustForSizeLimits({
    container: container,
    subject: subject,
    proposedScroll: required
  });

  if (!limited) {
    return null;
  }

  return isEqual(limited, origin$5) ? null : limited;
};

var withPlaceholder = function withPlaceholder(droppable, draggable) {
  var closest$$1 = droppable.viewport.closestScrollable;

  if (!closest$$1) {
    return null;
  }

  var isOverHome = droppable.descriptor.id === draggable.descriptor.droppableId;
  var max = closest$$1.scroll.max;
  var current = closest$$1.scroll.current;

  if (isOverHome) {
    return { max: max, current: current };
  }

  var spaceForPlaceholder = patch(droppable.axis.line, draggable.placeholder.client.borderBox[droppable.axis.size]);

  var newMax = add(max, spaceForPlaceholder);

  var newCurrent = {
    x: Math.min(current.x, newMax.x),
    y: Math.min(current.y, newMax.y)
  };

  return {
    max: newMax,
    current: newCurrent
  };
};

var createFluidScroller = (function (_ref3) {
  var scrollWindow = _ref3.scrollWindow,
      scrollDroppable = _ref3.scrollDroppable;

  var scheduleWindowScroll = rafSchd(scrollWindow);
  var scheduleDroppableScroll = rafSchd(scrollDroppable);

  var scroller = function scroller(state) {
    var drag = state.drag;
    if (!drag) {
      console.error('Invalid drag state');
      return;
    }

    var center = drag.current.page.borderBoxCenter;

    var draggable = state.dimension.draggable[drag.initial.descriptor.id];
    var subject = draggable.page.marginBox;
    var viewport = drag.current.viewport;
    var requiredWindowScroll = getRequiredScroll({
      container: viewport.subject,
      subject: subject,
      center: center
    });

    if (requiredWindowScroll && canScrollWindow(viewport, requiredWindowScroll)) {
      scheduleWindowScroll(requiredWindowScroll);
      return;
    }

    var droppable = getBestScrollableDroppable({
      center: center,
      destination: drag.impact.destination,
      droppables: state.dimension.droppable
    });

    if (!droppable) {
      return;
    }

    var closestScrollable = droppable.viewport.closestScrollable;

    if (!closestScrollable) {
      return;
    }

    var requiredFrameScroll = getRequiredScroll({
      container: closestScrollable.framePageMarginBox,
      subject: subject,
      center: center
    });

    if (!requiredFrameScroll) {
      return;
    }

    var result = withPlaceholder(droppable, draggable);

    if (!result) {
      return;
    }

    var canScrollDroppable$$1 = canPartiallyScroll({
      max: result.max,
      current: result.current,
      change: requiredFrameScroll
    });

    if (canScrollDroppable$$1) {
      scheduleDroppableScroll(droppable.descriptor.id, requiredFrameScroll);
    }
  };

  scroller.cancel = function () {
    scheduleWindowScroll.cancel();
    scheduleDroppableScroll.cancel();
  };

  return scroller;
});

var createJumpScroller = (function (_ref) {
  var move = _ref.move,
      scrollDroppable = _ref.scrollDroppable,
      scrollWindow = _ref.scrollWindow;

  var moveByOffset = function moveByOffset(state, offset) {
    var drag = state.drag;
    if (!drag) {
      console.error('Cannot move by offset when not dragging');
      return;
    }

    var client = add(drag.current.client.selection, offset);
    move(drag.initial.descriptor.id, client, drag.current.viewport, true);
  };

  var scrollDroppableAsMuchAsItCan = function scrollDroppableAsMuchAsItCan(droppable, change) {
    if (!canScrollDroppable(droppable, change)) {
      return change;
    }

    var overlap = getDroppableOverlap(droppable, change);

    if (!overlap) {
      scrollDroppable(droppable.descriptor.id, change);
      return null;
    }

    var whatTheDroppableCanScroll = subtract(change, overlap);
    scrollDroppable(droppable.descriptor.id, whatTheDroppableCanScroll);

    var remainder = subtract(change, whatTheDroppableCanScroll);
    return remainder;
  };

  var scrollWindowAsMuchAsItCan = function scrollWindowAsMuchAsItCan(viewport, change) {
    if (!canScrollWindow(viewport, change)) {
      return change;
    }

    var overlap = getWindowOverlap(viewport, change);

    if (!overlap) {
      scrollWindow(change);
      return null;
    }

    var whatTheWindowCanScroll = subtract(change, overlap);
    scrollWindow(whatTheWindowCanScroll);

    var remainder = subtract(change, whatTheWindowCanScroll);
    return remainder;
  };

  var jumpScroller = function jumpScroller(state) {
    var drag = state.drag;

    if (!drag) {
      return;
    }

    var request = drag.scrollJumpRequest;

    if (!request) {
      return;
    }

    var destination = drag.impact.destination;

    if (!destination) {
      console.error('Cannot perform a jump scroll when there is no destination');
      return;
    }

    var droppableRemainder = scrollDroppableAsMuchAsItCan(state.dimension.droppable[destination.droppableId], request);

    if (!droppableRemainder) {
      return;
    }

    var viewport = drag.current.viewport;
    var windowRemainder = scrollWindowAsMuchAsItCan(viewport, droppableRemainder);

    if (!windowRemainder) {
      return;
    }

    moveByOffset(state, windowRemainder);
  };

  return jumpScroller;
});

var createAutoScroller = (function (_ref) {
  var scrollDroppable = _ref.scrollDroppable,
      scrollWindow = _ref.scrollWindow,
      move = _ref.move;

  var fluidScroll = createFluidScroller({
    scrollWindow: scrollWindow,
    scrollDroppable: scrollDroppable
  });

  var jumpScroll = createJumpScroller({
    move: move,
    scrollWindow: scrollWindow,
    scrollDroppable: scrollDroppable
  });

  var onStateChange = function onStateChange(previous, current) {
    if (current.phase === 'DRAGGING') {
      if (!current.drag) {
        console.error('invalid drag state');
        return;
      }

      if (current.drag.initial.autoScrollMode === 'FLUID') {
        fluidScroll(current);
        return;
      }

      if (!current.drag.scrollJumpRequest) {
        return;
      }

      jumpScroll(current);
      return;
    }

    if (previous.phase === 'DRAGGING' && current.phase !== 'DRAGGING') {
      fluidScroll.cancel();
    }
  };

  var marshal = {
    onStateChange: onStateChange
  };

  return marshal;
});

var prefix$1 = function prefix(key) {
  return 'private-react-beautiful-dnd-key-do-not-use-' + key;
};

var storeKey = prefix$1('store');
var droppableIdKey = prefix$1('droppable-id');
var dimensionMarshalKey = prefix$1('dimension-marshal');
var styleContextKey = prefix$1('style-context');
var canLiftContextKey = prefix$1('can-lift');

var getNewHomeClientBorderBoxCenter = (function (_ref) {
  var movement = _ref.movement,
      draggable = _ref.draggable,
      draggables = _ref.draggables,
      destination = _ref.destination;

  var originalCenter = draggable.client.borderBox.center;

  if (destination == null) {
    return originalCenter;
  }

  var displaced = movement.displaced,
      isBeyondStartPosition = movement.isBeyondStartPosition;

  var axis = destination.axis;

  var isWithinHomeDroppable = destination.descriptor.id === draggable.descriptor.droppableId;

  if (isWithinHomeDroppable && !displaced.length) {
    return originalCenter;
  }

  var draggablesInDestination = getDraggablesInsideDroppable(destination, draggables);

  var movingRelativeTo = function () {
    if (isWithinHomeDroppable) {
      return draggables[displaced[0].draggableId].client.borderBox;
    }

    if (displaced.length) {
      return draggables[displaced[0].draggableId].client.borderBox;
    }

    if (draggablesInDestination.length) {
      return draggablesInDestination[draggablesInDestination.length - 1].client.marginBox;
    }

    return destination.client.contentBox;
  }();

  var _ref2 = function () {
    if (isWithinHomeDroppable) {
      if (isBeyondStartPosition) {
        return { sourceEdge: 'end', destinationEdge: 'end' };
      }

      return { sourceEdge: 'start', destinationEdge: 'start' };
    }

    if (!displaced.length && draggablesInDestination.length) {
      return { sourceEdge: 'start', destinationEdge: 'end' };
    }

    return { sourceEdge: 'start', destinationEdge: 'start' };
  }(),
      sourceEdge = _ref2.sourceEdge,
      destinationEdge = _ref2.destinationEdge;

  var source = draggable.client.borderBox;

  var targetCenter = moveToEdge({
    source: source,
    sourceEdge: sourceEdge,
    destination: movingRelativeTo,
    destinationEdge: destinationEdge,
    destinationAxis: axis
  });

  return targetCenter;
});

var origin$6 = { x: 0, y: 0 };

var getScrollDiff = function getScrollDiff(_ref) {
  var initial = _ref.initial,
      current = _ref.current,
      droppable = _ref.droppable;

  var windowScrollDiff = subtract(initial.viewport.scroll, current.viewport.scroll);

  if (!droppable) {
    return windowScrollDiff;
  }

  return withDroppableDisplacement(droppable, windowScrollDiff);
};

var requestDimensions = function requestDimensions(request) {
  return {
    type: 'REQUEST_DIMENSIONS',
    payload: request
  };
};

var completeLift = function completeLift(id, client, viewport, autoScrollMode) {
  return {
    type: 'COMPLETE_LIFT',
    payload: {
      id: id,
      client: client,
      viewport: viewport,
      autoScrollMode: autoScrollMode
    }
  };
};

var publishDraggableDimension = function publishDraggableDimension(dimension) {
  return {
    type: 'PUBLISH_DRAGGABLE_DIMENSION',
    payload: dimension
  };
};

var publishDroppableDimension = function publishDroppableDimension(dimension) {
  return {
    type: 'PUBLISH_DROPPABLE_DIMENSION',
    payload: dimension
  };
};

var bulkPublishDimensions = function bulkPublishDimensions(droppables, draggables) {
  return {
    type: 'BULK_DIMENSION_PUBLISH',
    payload: {
      droppables: droppables,
      draggables: draggables
    }
  };
};

var updateDroppableDimensionScroll = function updateDroppableDimensionScroll(id, offset) {
  return {
    type: 'UPDATE_DROPPABLE_DIMENSION_SCROLL',
    payload: {
      id: id,
      offset: offset
    }
  };
};

var updateDroppableDimensionIsEnabled = function updateDroppableDimensionIsEnabled(id, isEnabled) {
  return {
    type: 'UPDATE_DROPPABLE_DIMENSION_IS_ENABLED',
    payload: {
      id: id,
      isEnabled: isEnabled
    }
  };
};

var move$1 = function move(id, client, viewport) {
  var shouldAnimate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  return {
    type: 'MOVE',
    payload: {
      id: id,
      client: client,
      viewport: viewport,
      shouldAnimate: shouldAnimate
    }
  };
};

var moveByWindowScroll = function moveByWindowScroll(id, viewport) {
  return {
    type: 'MOVE_BY_WINDOW_SCROLL',
    payload: {
      id: id,
      viewport: viewport
    }
  };
};

var moveBackward = function moveBackward(id) {
  return {
    type: 'MOVE_BACKWARD',
    payload: id
  };
};

var moveForward = function moveForward(id) {
  return {
    type: 'MOVE_FORWARD',
    payload: id
  };
};

var crossAxisMoveForward = function crossAxisMoveForward(id) {
  return {
    type: 'CROSS_AXIS_MOVE_FORWARD',
    payload: id
  };
};

var crossAxisMoveBackward = function crossAxisMoveBackward(id) {
  return {
    type: 'CROSS_AXIS_MOVE_BACKWARD',
    payload: id
  };
};

var clean$2 = function clean() {
  return {
    type: 'CLEAN',
    payload: null
  };
};

var prepare = function prepare() {
  return {
    type: 'PREPARE',
    payload: null
  };
};

var animateDrop = function animateDrop(_ref2) {
  var newHomeOffset = _ref2.newHomeOffset,
      impact = _ref2.impact,
      result = _ref2.result;
  return {
    type: 'DROP_ANIMATE',
    payload: {
      newHomeOffset: newHomeOffset,
      impact: impact,
      result: result
    }
  };
};

var completeDrop = function completeDrop(result) {
  return {
    type: 'DROP_COMPLETE',
    payload: result
  };
};

var drop = function drop() {
  return function (dispatch, getState) {
    var state = getState();

    if (state.phase === 'PREPARING' || state.phase === 'COLLECTING_INITIAL_DIMENSIONS') {
      dispatch(clean$2());
      return;
    }

    if (state.phase !== 'DRAGGING') {
      console.error('not able to drop in phase: \'' + state.phase + '\'');
      dispatch(clean$2());
      return;
    }

    if (!state.drag) {
      console.error('not able to drop when there is invalid drag state', state);
      dispatch(clean$2());
      return;
    }

    var _state$drag = state.drag,
        impact = _state$drag.impact,
        initial = _state$drag.initial,
        current = _state$drag.current;

    var descriptor = initial.descriptor;
    var draggable = state.dimension.draggable[initial.descriptor.id];
    var home = state.dimension.droppable[draggable.descriptor.droppableId];
    var destination = impact.destination ? state.dimension.droppable[impact.destination.droppableId] : null;

    var source = {
      droppableId: descriptor.droppableId,
      index: descriptor.index
    };

    var result = {
      draggableId: descriptor.id,
      type: home.descriptor.type,
      source: source,
      destination: impact.destination,
      reason: 'DROP'
    };

    var newBorderBoxCenter = getNewHomeClientBorderBoxCenter({
      movement: impact.movement,
      draggable: draggable,
      draggables: state.dimension.draggable,
      destination: destination
    });

    var clientOffset = subtract(newBorderBoxCenter, draggable.client.borderBox.center);
    var scrollDiff = getScrollDiff({
      initial: initial,
      current: current,
      droppable: destination || home
    });
    var newHomeOffset = add(clientOffset, scrollDiff);

    var isAnimationRequired = !isEqual(current.client.offset, newHomeOffset);

    if (!isAnimationRequired) {
      dispatch(completeDrop(result));
      return;
    }

    dispatch(animateDrop({
      newHomeOffset: newHomeOffset,
      impact: impact,
      result: result
    }));
  };
};

var cancel = function cancel() {
  return function (dispatch, getState) {
    var state = getState();

    if (state.phase !== 'DRAGGING') {
      dispatch(clean$2());
      return;
    }

    if (!state.drag) {
      console.error('invalid drag state', state);
      dispatch(clean$2());
      return;
    }

    var _state$drag2 = state.drag,
        initial = _state$drag2.initial,
        current = _state$drag2.current;

    var descriptor = initial.descriptor;
    var home = state.dimension.droppable[descriptor.droppableId];

    var source = {
      index: descriptor.index,
      droppableId: descriptor.droppableId
    };

    var result = {
      draggableId: descriptor.id,
      type: home.descriptor.type,
      source: source,

      destination: null,
      reason: 'CANCEL'
    };

    var isAnimationRequired = !isEqual(current.client.offset, origin$6);

    if (!isAnimationRequired) {
      dispatch(completeDrop(result));
      return;
    }

    var scrollDiff = getScrollDiff({ initial: initial, current: current, droppable: home });

    dispatch(animateDrop({
      newHomeOffset: scrollDiff,
      impact: noImpact,
      result: result
    }));
  };
};

var dropAnimationFinished = function dropAnimationFinished() {
  return function (dispatch, getState) {
    var state = getState();

    if (state.phase !== 'DROP_ANIMATING') {
      console.error('cannot end drop that is no longer animating', state);
      dispatch(clean$2());
      return;
    }

    if (!state.drop || !state.drop.pending) {
      console.error('cannot end drop that has no pending state', state);
      dispatch(clean$2());
      return;
    }

    dispatch(completeDrop(state.drop.pending.result));
  };
};

var lift = function lift(id, client, viewport, autoScrollMode) {
  return function (dispatch, getState) {
    var initial = getState();

    if (initial.phase === 'DROP_ANIMATING') {
      if (!initial.drop || !initial.drop.pending) {
        console.error('cannot flush drop animation if there is no pending');
        dispatch(clean$2());
      } else {
        dispatch(completeDrop(initial.drop.pending.result));
      }
    }

    dispatch(prepare());

    setTimeout(function () {
      var state = getState();

      if (state.phase !== 'PREPARING') {
        return;
      }

      var scrollOptions = {
        shouldPublishImmediately: autoScrollMode === 'JUMP'
      };
      var request = {
        draggableId: id,
        scrollOptions: scrollOptions
      };
      dispatch(requestDimensions(request));

      setTimeout(function () {
        var newState = getState();

        if (newState.phase !== 'COLLECTING_INITIAL_DIMENSIONS') {
          return;
        }

        dispatch(completeLift(id, client, viewport, autoScrollMode));
        finish('LIFT');
      });
    });
  };
};

var _DragDropContext$chil;

var resetServerContext = function resetServerContext() {
  resetStyleContext();
};

var DragDropContext = function (_React$Component) {
  _inherits(DragDropContext, _React$Component);

  function DragDropContext(props, context) {
    _classCallCheck(this, DragDropContext);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props, context));

    _this.canLift = function (id) {
      return canStartDrag(_this.store.getState(), id);
    };

    _this.store = createStore$1();

    _this.announcer = createAnnouncer();

    _this.hookCaller = createHookCaller(_this.announcer.announce);

    _this.styleMarshal = createStyleMarshal();

    var callbacks = {
      cancel: function cancel$$1() {
        _this.store.dispatch(clean$2());
      },
      publishDraggable: function publishDraggable(dimension) {
        _this.store.dispatch(publishDraggableDimension(dimension));
      },
      publishDroppable: function publishDroppable(dimension) {
        _this.store.dispatch(publishDroppableDimension(dimension));
      },
      bulkPublish: function bulkPublish(droppables, draggables) {
        _this.store.dispatch(bulkPublishDimensions(droppables, draggables));
      },
      updateDroppableScroll: function updateDroppableScroll(id, newScroll) {
        _this.store.dispatch(updateDroppableDimensionScroll(id, newScroll));
      },
      updateDroppableIsEnabled: function updateDroppableIsEnabled(id, isEnabled) {
        _this.store.dispatch(updateDroppableDimensionIsEnabled(id, isEnabled));
      }
    };
    _this.dimensionMarshal = createDimensionMarshal(callbacks);
    _this.autoScroller = createAutoScroller({
      scrollWindow: scrollWindow,
      scrollDroppable: _this.dimensionMarshal.scrollDroppable,
      move: function move$$1(id, client, viewport, shouldAnimate) {
        _this.store.dispatch(move$1(id, client, viewport, shouldAnimate));
      }
    });

    var previous = _this.store.getState();

    _this.unsubscribe = _this.store.subscribe(function () {
      var current = _this.store.getState();
      var previousInThisExecution = previous;
      var isPhaseChanging = current.phase !== previous.phase;

      previous = current;

      if (isPhaseChanging) {
        _this.styleMarshal.onPhaseChange(current);
      }

      var isDragEnding = previousInThisExecution.phase === 'DRAGGING' && current.phase !== 'DRAGGING';

      if (isDragEnding) {
        _this.dimensionMarshal.onPhaseChange(current);
      }

      var hooks = {
        onDragStart: _this.props.onDragStart,
        onDragEnd: _this.props.onDragEnd,
        onDragUpdate: _this.props.onDragUpdate
      };
      _this.hookCaller.onStateChange(hooks, previousInThisExecution, current);

      if (isPhaseChanging && !isDragEnding) {
        _this.dimensionMarshal.onPhaseChange(current);
      }

      _this.autoScroller.onStateChange(previousInThisExecution, current);
    });
    return _this;
  }

  DragDropContext.prototype.getChildContext = function getChildContext() {
    var _ref;

    return _ref = {}, _ref[storeKey] = this.store, _ref[dimensionMarshalKey] = this.dimensionMarshal, _ref[styleContextKey] = this.styleMarshal.styleContext, _ref[canLiftContextKey] = this.canLift, _ref;
  };

  DragDropContext.prototype.componentDidMount = function componentDidMount() {
    this.styleMarshal.mount();
    this.announcer.mount();
  };

  DragDropContext.prototype.componentWillUnmount = function componentWillUnmount() {
    this.unsubscribe();
    this.styleMarshal.unmount();
    this.announcer.unmount();
  };

  DragDropContext.prototype.render = function render() {
    return this.props.children;
  };

  return DragDropContext;
}(React.Component);

DragDropContext.childContextTypes = (_DragDropContext$chil = {}, _DragDropContext$chil[storeKey] = PropTypes.shape({
  dispatch: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
}).isRequired, _DragDropContext$chil[dimensionMarshalKey] = PropTypes.object.isRequired, _DragDropContext$chil[styleContextKey] = PropTypes.string.isRequired, _DragDropContext$chil[canLiftContextKey] = PropTypes.func.isRequired, _DragDropContext$chil);

var phaseSelector = function phaseSelector(state) {
  return state.phase;
};

var pendingDropSelector = function pendingDropSelector(state) {
  if (!state.drop || !state.drop.pending) {
    return null;
  }
  return state.drop.pending;
};

var dragSelector = function dragSelector(state) {
  return state.drag;
};

var draggableMapSelector = function draggableMapSelector(state) {
  return state.dimension.draggable;
};

var draggingDraggableSelector = createSelector([phaseSelector, dragSelector, pendingDropSelector, draggableMapSelector], function (phase, drag, pending, draggables) {
  if (phase === 'DRAGGING') {
    if (!drag) {
      console.error('cannot get placeholder dimensions as there is an invalid drag state');
      return null;
    }

    var draggable = draggables[drag.initial.descriptor.id];
    return draggable;
  }

  if (phase === 'DROP_ANIMATING') {
    if (!pending) {
      console.error('cannot get placeholder dimensions as there is an invalid drag state');
      return null;
    }

    if (!pending.result.destination) {
      return null;
    }

    var _draggable = draggables[pending.result.draggableId];
    return _draggable;
  }

  return null;
});

var isScrollable = function isScrollable() {
  for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }

  return values.some(function (value) {
    return value === 'auto' || value === 'scroll';
  });
};

var isElementScrollable = function isElementScrollable(el) {
  var style = window.getComputedStyle(el);
  return isScrollable(style.overflow, style.overflowY, style.overflowX);
};

var getClosestScrollable = function getClosestScrollable(el) {
  if (el == null) {
    return null;
  }

  if (!isElementScrollable(el)) {
    return getClosestScrollable(el.parentElement);
  }

  return el;
};

var _DroppableDimensionPu;


var origin$7 = { x: 0, y: 0 };

var getScroll = function getScroll(el) {
  return {
    x: el.scrollLeft,
    y: el.scrollTop
  };
};

var DroppableDimensionPublisher = function (_Component) {
  _inherits(DroppableDimensionPublisher, _Component);

  function DroppableDimensionPublisher(props, context) {
    _classCallCheck(this, DroppableDimensionPublisher);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.closestScrollable = null;
    _this.isWatchingScroll = false;
    _this.scrollOptions = null;
    _this.publishedDescriptor = null;

    _this.getClosestScroll = function () {
      if (!_this.closestScrollable) {
        return origin$7;
      }

      return getScroll(_this.closestScrollable);
    };

    _this.memoizedUpdateScroll = memoizeOne(function (x, y) {
      if (!_this.publishedDescriptor) {
        console.error('Cannot update scroll on unpublished droppable');
        return;
      }

      var newScroll = { x: x, y: y };
      var marshal = _this.context[dimensionMarshalKey];
      marshal.updateDroppableScroll(_this.publishedDescriptor.id, newScroll);
    });

    _this.updateScroll = function () {
      var offset = _this.getClosestScroll();
      _this.memoizedUpdateScroll(offset.x, offset.y);
    };

    _this.scheduleScrollUpdate = rafSchd(_this.updateScroll);

    _this.onClosestScroll = function () {
      if (!_this.scrollOptions) {
        console.error('Cannot find scroll options while scrolling');
        return;
      }
      if (_this.scrollOptions.shouldPublishImmediately) {
        _this.updateScroll();
        return;
      }
      _this.scheduleScrollUpdate();
    };

    _this.scroll = function (change) {
      if (_this.closestScrollable == null) {
        console.error('Cannot scroll a droppable with no closest scrollable');
        return;
      }

      if (!_this.isWatchingScroll) {
        console.error('Updating Droppable scroll while not watching for updates');
        return;
      }

      _this.closestScrollable.scrollTop += change.y;
      _this.closestScrollable.scrollLeft += change.x;
    };

    _this.watchScroll = function (options) {
      if (!_this.props.getDroppableRef()) {
        console.error('cannot watch droppable scroll if not in the dom');
        return;
      }

      if (_this.closestScrollable == null) {
        return;
      }

      if (_this.isWatchingScroll) {
        return;
      }

      _this.isWatchingScroll = true;
      _this.scrollOptions = options;
      _this.closestScrollable.addEventListener('scroll', _this.onClosestScroll, { passive: true });
    };

    _this.unwatchScroll = function () {
      if (!_this.isWatchingScroll) {
        return;
      }

      _this.isWatchingScroll = false;
      _this.scrollOptions = null;
      _this.scheduleScrollUpdate.cancel();

      if (!_this.closestScrollable) {
        console.error('cannot unbind event listener if element is null');
        return;
      }

      _this.closestScrollable.removeEventListener('scroll', _this.onClosestScroll);
    };

    _this.getMemoizedDescriptor = memoizeOne(function (id, type) {
      return {
        id: id,
        type: type
      };
    });

    _this.publish = function () {
      var descriptor = _this.getMemoizedDescriptor(_this.props.droppableId, _this.props.type);

      if (descriptor === _this.publishedDescriptor) {
        return;
      }

      if (_this.publishedDescriptor) {
        _this.unpublish();
      }

      var marshal = _this.context[dimensionMarshalKey];
      marshal.registerDroppable(descriptor, _this.callbacks);
      _this.publishedDescriptor = descriptor;
    };

    _this.unpublish = function () {
      if (!_this.publishedDescriptor) {
        console.error('Cannot unpublish descriptor when none is published');
        return;
      }

      var marshal = _this.context[dimensionMarshalKey];
      marshal.unregisterDroppable(_this.publishedDescriptor);
      _this.publishedDescriptor = null;
    };

    _this.getDimension = function () {
      var _this$props = _this.props,
          direction = _this$props.direction,
          ignoreContainerClipping = _this$props.ignoreContainerClipping,
          isDropDisabled = _this$props.isDropDisabled,
          getDroppableRef = _this$props.getDroppableRef;


      var targetRef = getDroppableRef();
      var descriptor = _this.publishedDescriptor;

      invariant(targetRef, 'DimensionPublisher cannot calculate a dimension when not attached to the DOM');
      invariant(!_this.isWatchingScroll, 'Attempting to recapture Droppable dimension while already watching scroll on previous capture');
      invariant(descriptor, 'Cannot get dimension for unpublished droppable');

      var scrollableRef = getClosestScrollable(targetRef);

      _this.closestScrollable = scrollableRef;

      var client = function () {
        var base = getBox(targetRef);

        if (!scrollableRef) {
          return base;
        }

        if (targetRef !== scrollableRef) {
          return base;
        }

        var top = base.paddingBox.top - scrollableRef.scrollTop;
        var left = base.paddingBox.left - scrollableRef.scrollLeft;
        var bottom = top + scrollableRef.scrollHeight;
        var right = left + scrollableRef.scrollWidth;

        var paddingBox = {
          top: top, right: right, bottom: bottom, left: left
        };

        var borderBox = {
          top: paddingBox.top - base.border.top,
          right: paddingBox.right + base.border.right,
          bottom: paddingBox.bottom + base.border.bottom,
          left: paddingBox.left - base.border.left
        };

        return createBox({
          borderBox: borderBox,
          margin: base.margin,
          border: base.border,
          padding: base.padding
        });
      }();

      var page = withScroll(client);

      var closest = function () {
        if (!scrollableRef) {
          return null;
        }

        var frameClient = getBox(scrollableRef);

        return {
          client: frameClient,
          page: withScroll(frameClient),
          scrollHeight: scrollableRef.scrollHeight,
          scrollWidth: scrollableRef.scrollWidth,
          scroll: getScroll(scrollableRef),
          shouldClipSubject: !ignoreContainerClipping
        };
      }();

      return getDroppableDimension({
        descriptor: descriptor,
        isEnabled: !isDropDisabled,
        direction: direction,
        client: client,
        page: page,
        closest: closest
      });
    };

    var callbacks = {
      getDimension: _this.getDimension,
      watchScroll: _this.watchScroll,
      unwatchScroll: _this.unwatchScroll,
      scroll: _this.scroll
    };
    _this.callbacks = callbacks;
    return _this;
  }

  DroppableDimensionPublisher.prototype.componentDidMount = function componentDidMount() {
    this.publish();
  };

  DroppableDimensionPublisher.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    this.publish();

    if (this.props.isDropDisabled === prevProps.isDropDisabled) {
      return;
    }

    var marshal = this.context[dimensionMarshalKey];
    marshal.updateDroppableIsEnabled(this.props.droppableId, !this.props.isDropDisabled);
  };

  DroppableDimensionPublisher.prototype.componentWillUnmount = function componentWillUnmount() {
    if (this.isWatchingScroll) {
      console.warn('unmounting droppable while it was watching scroll');
      this.unwatchScroll();
    }

    this.unpublish();
  };

  DroppableDimensionPublisher.prototype.render = function render() {
    return this.props.children;
  };

  return DroppableDimensionPublisher;
}(Component);

DroppableDimensionPublisher.contextTypes = (_DroppableDimensionPu = {}, _DroppableDimensionPu[dimensionMarshalKey] = PropTypes.object.isRequired, _DroppableDimensionPu);

var Placeholder = function (_PureComponent) {
  _inherits(Placeholder, _PureComponent);

  function Placeholder() {
    _classCallCheck(this, Placeholder);

    return _possibleConstructorReturn(this, _PureComponent.apply(this, arguments));
  }

  Placeholder.prototype.render = function render() {
    var placeholder = this.props.placeholder;
    var client = placeholder.client;
    var display = placeholder.display;
    var tagName = placeholder.tagName;

    var style = {
      display: display,

      width: client.borderBox.width,
      height: client.borderBox.height,

      boxSizing: 'border-box',

      marginTop: client.margin.top,
      marginLeft: client.margin.left,
      marginBottom: client.margin.bottom,
      marginRight: client.margin.right,

      flexShrink: '0',
      flexGrow: '0',

      pointerEvents: 'none'
    };

    return React.createElement(tagName, { style: style });
  };

  return Placeholder;
}(PureComponent);

var _Droppable$contextTyp, _Droppable$childConte;

var Droppable = function (_Component) {
  _inherits(Droppable, _Component);

  function Droppable(props, context) {
    _classCallCheck(this, Droppable);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.ref = null;

    _this.setRef = function (ref) {
      if (ref === null) {
        return;
      }

      if (ref === _this.ref) {
        return;
      }

      _this.ref = ref;
    };

    _this.getDroppableRef = function () {
      return _this.ref;
    };

    _this.styleContext = context[styleContextKey];
    return _this;
  }

  Droppable.prototype.getChildContext = function getChildContext() {
    var _value;

    var value = (_value = {}, _value[droppableIdKey] = this.props.droppableId, _value);
    return value;
  };

  Droppable.prototype.componentDidMount = function componentDidMount() {
    if (!this.ref) {
      console.error('\n        Droppable has not been provided with a ref.\n        Please use the DroppableProvided > innerRef function\n      ');
    }
  };

  Droppable.prototype.getPlaceholder = function getPlaceholder() {
    if (!this.props.placeholder) {
      return null;
    }

    return React.createElement(Placeholder, { placeholder: this.props.placeholder });
  };

  Droppable.prototype.render = function render() {
    var _props = this.props,
        children = _props.children,
        direction = _props.direction,
        droppableId = _props.droppableId,
        ignoreContainerClipping = _props.ignoreContainerClipping,
        isDraggingOver = _props.isDraggingOver,
        isDropDisabled = _props.isDropDisabled,
        draggingOverWith = _props.draggingOverWith,
        type = _props.type;

    var provided = {
      innerRef: this.setRef,
      placeholder: this.getPlaceholder(),
      droppableProps: {
        'data-react-beautiful-dnd-droppable': this.styleContext
      }
    };
    var snapshot = {
      isDraggingOver: isDraggingOver,
      draggingOverWith: draggingOverWith
    };

    return React.createElement(
      DroppableDimensionPublisher,
      {
        droppableId: droppableId,
        type: type,
        direction: direction,
        ignoreContainerClipping: ignoreContainerClipping,
        isDropDisabled: isDropDisabled,
        getDroppableRef: this.getDroppableRef
      },
      children(provided, snapshot)
    );
  };

  return Droppable;
}(Component);

Droppable.contextTypes = (_Droppable$contextTyp = {}, _Droppable$contextTyp[styleContextKey] = PropTypes.string.isRequired, _Droppable$contextTyp);
Droppable.childContextTypes = (_Droppable$childConte = {}, _Droppable$childConte[droppableIdKey] = PropTypes.string.isRequired, _Droppable$childConte);

var makeSelector = function makeSelector() {
  var idSelector = function idSelector(state, ownProps) {
    return ownProps.droppableId;
  };
  var isDropDisabledSelector = function isDropDisabledSelector(state, ownProps) {
    return ownProps.isDropDisabled || false;
  };

  var getIsDraggingOver = memoizeOne(function (id, destination) {
    if (!destination) {
      return false;
    }
    return destination.droppableId === id;
  });

  var getPlaceholder = memoizeOne(function (id, destination, draggable) {
    if (!draggable) {
      return null;
    }

    if (!destination) {
      return null;
    }

    if (id === draggable.descriptor.droppableId) {
      return null;
    }

    if (id !== destination.droppableId) {
      return null;
    }

    return draggable.placeholder;
  });

  var getMapProps = memoizeOne(function (isDraggingOver, draggingOverWith, placeholder) {
    return {
      isDraggingOver: isDraggingOver,
      draggingOverWith: draggingOverWith,
      placeholder: placeholder
    };
  });

  return createSelector([phaseSelector, dragSelector, draggingDraggableSelector, pendingDropSelector, idSelector, isDropDisabledSelector], function (phase, drag, draggable, pending, id, isDropDisabled) {
    if (isDropDisabled) {
      return getMapProps(false, null, null);
    }

    if (phase === 'DRAGGING') {
      if (!drag) {
        console.error('cannot determine dragging over as there is not drag');
        return getMapProps(false, null, null);
      }

      var isDraggingOver = getIsDraggingOver(id, drag.impact.destination);
      var draggingOverWith = isDraggingOver ? drag.initial.descriptor.id : null;

      var placeholder = getPlaceholder(id, drag.impact.destination, draggable);

      return getMapProps(isDraggingOver, draggingOverWith, placeholder);
    }

    if (phase === 'DROP_ANIMATING') {
      if (!pending) {
        console.error('cannot determine dragging over as there is no pending result');
        return getMapProps(false, null, null);
      }

      var _isDraggingOver = getIsDraggingOver(id, pending.impact.destination);
      var _draggingOverWith = _isDraggingOver ? pending.result.draggableId : null;

      var _placeholder = getPlaceholder(id, pending.result.destination, draggable);
      return getMapProps(_isDraggingOver, _draggingOverWith, _placeholder);
    }

    return getMapProps(false, null, null);
  });
};

var makeMapStateToProps = function makeMapStateToProps() {
  var selector = makeSelector();
  return function (state, props) {
    return selector(state, props);
  };
};

var connectedDroppable = connect(makeMapStateToProps, null, null, { storeKey: storeKey })(Droppable);

connectedDroppable.defaultProps = {
  type: 'DEFAULT',
  isDropDisabled: false,
  direction: 'vertical',
  ignoreContainerClipping: false
};

var getWindowScroll = (function () {
  return {
    x: window.pageXOffset,
    y: window.pageYOffset
  };
});

var _DraggableDimensionPu;

var DraggableDimensionPublisher = function (_Component) {
  _inherits(DraggableDimensionPublisher, _Component);

  function DraggableDimensionPublisher() {
    var _temp, _this, _ret;

    _classCallCheck(this, DraggableDimensionPublisher);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.publishedDescriptor = null, _this.getMemoizedDescriptor = memoizeOne(function (id, droppableId, index) {
      return {
        id: id,
        droppableId: droppableId,
        index: index
      };
    }), _this.publish = function () {
      var descriptor = _this.getMemoizedDescriptor(_this.props.draggableId, _this.props.droppableId, _this.props.index);

      if (descriptor === _this.publishedDescriptor) {
        return;
      }

      if (_this.publishedDescriptor) {
        _this.unpublish();
      }

      var marshal = _this.context[dimensionMarshalKey];
      marshal.registerDraggable(descriptor, _this.getDimension);
      _this.publishedDescriptor = descriptor;
    }, _this.unpublish = function () {
      if (!_this.publishedDescriptor) {
        console.error('cannot unpublish descriptor when none is published');
        return;
      }

      var marshal = _this.context[dimensionMarshalKey];
      marshal.unregisterDraggable(_this.publishedDescriptor);
      _this.publishedDescriptor = null;
    }, _this.getDimension = function () {
      var targetRef = _this.props.getDraggableRef();
      var descriptor = _this.publishedDescriptor;

      invariant(targetRef, 'DraggableDimensionPublisher cannot calculate a dimension when not attached to the DOM');
      invariant(descriptor, 'Cannot get dimension for unpublished draggable');

      var style = window.getComputedStyle(targetRef);

      var client = calculateBox(targetRef.getBoundingClientRect(), style);
      var page = withScroll(client, getWindowScroll());

      var placeholder = {
        client: client,
        tagName: targetRef.tagName.toLowerCase(),
        display: style.display
      };

      var dimension = {
        descriptor: descriptor,
        placeholder: placeholder,
        client: client,
        page: page
      };

      return dimension;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  DraggableDimensionPublisher.prototype.componentDidMount = function componentDidMount() {
    this.publish();
  };

  DraggableDimensionPublisher.prototype.componentDidUpdate = function componentDidUpdate() {
    this.publish();
  };

  DraggableDimensionPublisher.prototype.componentWillUnmount = function componentWillUnmount() {
    this.unpublish();
  };

  DraggableDimensionPublisher.prototype.render = function render() {
    return this.props.children;
  };

  return DraggableDimensionPublisher;
}(Component);

DraggableDimensionPublisher.contextTypes = (_DraggableDimensionPu = {}, _DraggableDimensionPu[dimensionMarshalKey] = PropTypes.object.isRequired, _DraggableDimensionPu);

var origin$8 = {
  x: 0,
  y: 0
};

var noMovement$1 = {
  transform: null
};

var isAtOrigin = function isAtOrigin(point) {
  return point.x === origin$8.x && point.y === origin$8.y;
};

var getStyle = function getStyle(isNotMoving, x, y) {
  if (isNotMoving) {
    return noMovement$1;
  }

  var point = { x: x, y: y };

  if (isAtOrigin(point)) {
    return noMovement$1;
  }
  var style = {
    transform: 'translate(' + point.x + 'px, ' + point.y + 'px)'
  };
  return style;
};

var Movable = function (_Component) {
  _inherits(Movable, _Component);

  function Movable() {
    var _temp, _this, _ret;

    _classCallCheck(this, Movable);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.onRest = function () {
      var onMoveEnd = _this.props.onMoveEnd;


      if (!onMoveEnd) {
        return;
      }

      setTimeout(function () {
        return onMoveEnd();
      });
    }, _this.getFinal = function () {
      var destination = _this.props.destination;
      var speed = _this.props.speed;

      if (speed === 'INSTANT') {
        return destination;
      }

      var selected = speed === 'FAST' ? physics.fast : physics.standard;

      return {
        x: spring(destination.x, selected),
        y: spring(destination.y, selected)
      };
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  Movable.prototype.render = function render() {
    var _this2 = this;

    var final = this.getFinal();

    var isNotMoving = isAtOrigin(final);

    return React.createElement(
      Motion,
      { defaultStyle: origin$8, style: final, onRest: this.onRest },
      function (current) {
        return _this2.props.children(getStyle(isNotMoving, current.x, current.y));
      }
    );
  };

  return Movable;
}(Component);

Movable.defaultProps = {
  destination: origin$8
};

var getWindowFromRef = (function (ref) {
  return ref ? ref.ownerDocument.defaultView : window;
});

var selector = '[' + dragHandle + ']';

var getDragHandleRef = function getDragHandleRef(draggableRef) {
  if (draggableRef.hasAttribute(dragHandle)) {
    return draggableRef;
  }

  var el = draggableRef.querySelector(selector);

  return el || null;
};

var retainingFocusFor = null;

var clearRetentionOnFocusChange = function () {
  var isBound = false;

  var bind = function bind() {
    if (isBound) {
      return;
    }

    isBound = true;

    window.addEventListener('focus', onWindowFocusChange, { capture: true });
  };

  var unbind = function unbind() {
    if (!isBound) {
      return;
    }

    isBound = false;

    window.removeEventListener('focus', onWindowFocusChange, { capture: true });
  };

  var onWindowFocusChange = function onWindowFocusChange() {
    unbind();
    retainingFocusFor = null;
  };

  var result = function result() {
    return bind();
  };
  result.cancel = function () {
    return unbind();
  };

  return result;
}();

var retain = function retain(id) {
  retainingFocusFor = id;
  clearRetentionOnFocusChange();
};

var tryRestoreFocus = function tryRestoreFocus(id, draggableRef) {
  if (!retainingFocusFor) {
    return;
  }

  if (id !== retainingFocusFor) {
    return;
  }

  retainingFocusFor = null;

  clearRetentionOnFocusChange.cancel();

  var dragHandleRef = getDragHandleRef(draggableRef);

  if (!dragHandleRef) {
    console.warn('Could not find drag handle in the DOM to focus on it');
    return;
  }
  dragHandleRef.focus();
};

var retainer = {
  retain: retain,
  tryRestoreFocus: tryRestoreFocus
};

var interactiveTagNames = {
  input: true,
  button: true,
  textarea: true,
  select: true,
  option: true,
  optgroup: true,
  video: true,
  audio: true
};

var isAnInteractiveElement = function isAnInteractiveElement(parent, current) {
  if (current == null) {
    return false;
  }

  var hasAnInteractiveTag = Boolean(interactiveTagNames[current.tagName.toLowerCase()]);

  if (hasAnInteractiveTag) {
    return true;
  }

  var attribute = current.getAttribute('contenteditable');
  if (attribute === 'true' || attribute === '') {
    return true;
  }

  if (current === parent) {
    return false;
  }

  return isAnInteractiveElement(parent, current.parentElement);
};

var shouldAllowDraggingFromTarget = (function (event, props) {
  if (props.canDragInteractiveElements) {
    return true;
  }

  var target = event.target,
      currentTarget = event.currentTarget;

  if (!(target instanceof Element) || !(currentTarget instanceof Element)) {
    return true;
  }

  return !isAnInteractiveElement(currentTarget, target);
});

var createScheduler = (function (callbacks) {
  var memoizedMove = memoizeOne(function (x, y) {
    var point = { x: x, y: y };
    callbacks.onMove(point);
  });

  var move = rafSchd(function (point) {
    return memoizedMove(point.x, point.y);
  });
  var moveForward = rafSchd(callbacks.onMoveForward);
  var moveBackward = rafSchd(callbacks.onMoveBackward);
  var crossAxisMoveForward = rafSchd(callbacks.onCrossAxisMoveForward);
  var crossAxisMoveBackward = rafSchd(callbacks.onCrossAxisMoveBackward);
  var windowScrollMove = rafSchd(callbacks.onWindowScroll);

  var cancel = function cancel() {

    move.cancel();
    moveForward.cancel();
    moveBackward.cancel();
    crossAxisMoveForward.cancel();
    crossAxisMoveBackward.cancel();
    windowScrollMove.cancel();
  };

  return {
    move: move,
    moveForward: moveForward,
    moveBackward: moveBackward,
    crossAxisMoveForward: crossAxisMoveForward,
    crossAxisMoveBackward: crossAxisMoveBackward,
    windowScrollMove: windowScrollMove,
    cancel: cancel
  };
});

var sloppyClickThreshold = 5;

var isSloppyClickThresholdExceeded = (function (original, current) {
  return Math.abs(current.x - original.x) >= sloppyClickThreshold || Math.abs(current.y - original.y) >= sloppyClickThreshold;
});

var tab = 9;
var enter = 13;
var escape = 27;
var space = 32;
var pageUp = 33;
var pageDown = 34;
var end = 35;
var home = 36;
var arrowLeft = 37;
var arrowUp = 38;
var arrowRight = 39;
var arrowDown = 40;

var _preventedKeys;

var preventedKeys = (_preventedKeys = {}, _preventedKeys[enter] = true, _preventedKeys[tab] = true, _preventedKeys);

var preventStandardKeyEvents = (function (event) {
  if (preventedKeys[event.keyCode]) {
    event.preventDefault();
  }
});

var bindEvents = function bindEvents(el, bindings, sharedOptions) {
  bindings.forEach(function (binding) {
    var options = _extends({}, sharedOptions, binding.options);

    el.addEventListener(binding.eventName, binding.fn, options);
  });
};

var unbindEvents = function unbindEvents(el, bindings, sharedOptions) {
  bindings.forEach(function (binding) {
    var options = _extends({}, sharedOptions, binding.options);

    el.removeEventListener(binding.eventName, binding.fn, options);
  });
};

var createPostDragEventPreventer = (function (getWindow) {
  var isBound = false;

  var bind = function bind() {
    if (isBound) {
      return;
    }
    isBound = true;
    bindEvents(getWindow(), pointerEvents, { capture: true });
  };

  var unbind = function unbind() {
    if (!isBound) {
      return;
    }
    isBound = false;
    unbindEvents(getWindow(), pointerEvents, { capture: true });
  };

  var pointerEvents = [{
    eventName: 'click',
    fn: function fn(event) {
      event.preventDefault();
      unbind();
    }
  }, {
    eventName: 'mousedown',

    fn: unbind
  }, {
    eventName: 'touchstart',
    fn: unbind
  }];

  var preventNext = function preventNext() {
    if (isBound) {
      unbind();
    }

    bind();
  };

  var preventer = {
    preventNext: preventNext,
    abort: unbind
  };

  return preventer;
});

var createEventMarshal = (function () {
  var isMouseDownHandled = false;

  var handle = function handle() {
    if (isMouseDownHandled) {
      console.error('Cannot handle mouse down as it is already handled');
      return;
    }
    isMouseDownHandled = true;
  };

  var isHandled = function isHandled() {
    return isMouseDownHandled;
  };

  var reset = function reset() {
    isMouseDownHandled = false;
  };

  return {
    handle: handle,
    isHandled: isHandled,
    reset: reset
  };
});

var supportedEventName = function () {
  var base = 'visibilitychange';

  if (typeof document === 'undefined') {
    return base;
  }

  var candidates = [base, 'ms' + base, 'webkit' + base, 'moz' + base, 'o' + base];

  var supported = candidates.find(function (eventName) {
    return 'on' + eventName in document;
  });

  return supported || base;
}();

var primaryButton = 0;
var noop = function noop() {};

var mouseDownMarshal = createEventMarshal();

var createMouseSensor = (function (_ref) {
  var callbacks = _ref.callbacks,
      getWindow = _ref.getWindow,
      canStartCapturing = _ref.canStartCapturing;

  var state = {
    isDragging: false,
    pending: null
  };
  var setState = function setState(newState) {
    state = newState;
  };
  var isDragging = function isDragging() {
    return state.isDragging;
  };
  var isCapturing = function isCapturing() {
    return Boolean(state.pending || state.isDragging);
  };
  var schedule = createScheduler(callbacks);
  var postDragEventPreventer = createPostDragEventPreventer(getWindow);

  var startDragging = function startDragging() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;

    setState({
      pending: null,
      isDragging: true
    });
    fn();
  };
  var stopDragging = function stopDragging() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;
    var shouldBlockClick = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    schedule.cancel();
    unbindWindowEvents();
    mouseDownMarshal.reset();
    if (shouldBlockClick) {
      postDragEventPreventer.preventNext();
    }
    setState({
      isDragging: false,
      pending: null
    });
    fn();
  };
  var startPendingDrag = function startPendingDrag(point) {
    setState({ pending: point, isDragging: false });
    bindWindowEvents();
  };
  var stopPendingDrag = function stopPendingDrag() {
    stopDragging(noop, false);
  };

  var kill = function kill() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;

    if (state.pending) {
      stopPendingDrag();
      return;
    }
    stopDragging(fn);
  };

  var unmount = function unmount() {
    kill();
    postDragEventPreventer.abort();
  };

  var cancel = function cancel() {
    kill(callbacks.onCancel);
  };

  var windowBindings = [{
    eventName: 'mousemove',
    fn: function fn(event) {
      var button = event.button,
          clientX = event.clientX,
          clientY = event.clientY;

      if (button !== primaryButton) {
        return;
      }

      var point = {
        x: clientX,
        y: clientY
      };

      if (state.isDragging) {
        event.preventDefault();
        schedule.move(point);
        return;
      }

      if (!state.pending) {
        console.error('invalid state');
        return;
      }

      if (!isSloppyClickThresholdExceeded(state.pending, point)) {
        return;
      }

      event.preventDefault();
      startDragging(function () {
        return callbacks.onLift({
          client: point,
          autoScrollMode: 'FLUID'
        });
      });
    }
  }, {
    eventName: 'mouseup',
    fn: function fn(event) {
      if (state.pending) {
        stopPendingDrag();
        return;
      }

      event.preventDefault();
      stopDragging(callbacks.onDrop);
    }
  }, {
    eventName: 'mousedown',
    fn: function fn(event) {
      if (state.isDragging) {
        event.preventDefault();
      }

      stopDragging(callbacks.onCancel);
    }
  }, {
    eventName: 'keydown',
    fn: function fn(event) {
      if (!state.isDragging) {
        cancel();
        return;
      }

      if (event.keyCode === escape) {
        event.preventDefault();
        cancel();
        return;
      }

      preventStandardKeyEvents(event);
    }
  }, {
    eventName: 'resize',
    fn: cancel
  }, {
    eventName: 'scroll',

    options: { passive: true, capture: false },
    fn: function fn() {
      if (state.pending) {
        stopPendingDrag();
        return;
      }
      schedule.windowScrollMove();
    }
  }, {
    eventName: 'webkitmouseforcechanged',
    fn: function fn(event) {
      if (event.webkitForce == null || MouseEvent.WEBKIT_FORCE_AT_FORCE_MOUSE_DOWN == null) {
        console.error('handling a mouse force changed event when it is not supported');
        return;
      }

      var forcePressThreshold = MouseEvent.WEBKIT_FORCE_AT_FORCE_MOUSE_DOWN;
      var isForcePressing = event.webkitForce >= forcePressThreshold;

      if (isForcePressing) {
        cancel();
      }
    }
  }, {
    eventName: supportedEventName,
    fn: cancel
  }];

  var bindWindowEvents = function bindWindowEvents() {
    var win = getWindow();
    bindEvents(win, windowBindings, { capture: true });
  };

  var unbindWindowEvents = function unbindWindowEvents() {
    var win = getWindow();
    unbindEvents(win, windowBindings, { capture: true });
  };

  var onMouseDown = function onMouseDown(event) {
    if (mouseDownMarshal.isHandled()) {
      return;
    }

    if (!canStartCapturing(event)) {
      return;
    }

    if (isCapturing()) {
      console.error('should not be able to perform a mouse down while a drag or pending drag is occurring');
      cancel();
      return;
    }

    if (event.button !== primaryButton) {
      return;
    }

    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return;
    }

    mouseDownMarshal.handle();

    event.preventDefault();

    var point = {
      x: event.clientX,
      y: event.clientY
    };

    startPendingDrag(point);
  };

  var sensor = {
    onMouseDown: onMouseDown,
    kill: kill,
    isCapturing: isCapturing,
    isDragging: isDragging,
    unmount: unmount
  };

  return sensor;
});

var getBorderBoxCenterPosition = (function (el) {
  return getRect(el.getBoundingClientRect()).center;
});

var _scrollJumpKeys;


var scrollJumpKeys = (_scrollJumpKeys = {}, _scrollJumpKeys[pageDown] = true, _scrollJumpKeys[pageUp] = true, _scrollJumpKeys[home] = true, _scrollJumpKeys[end] = true, _scrollJumpKeys);

var noop$1 = function noop() {};

var createKeyboardSensor = (function (_ref) {
  var callbacks = _ref.callbacks,
      getWindow = _ref.getWindow,
      getDraggableRef = _ref.getDraggableRef,
      canStartCapturing = _ref.canStartCapturing;

  var state = {
    isDragging: false
  };
  var setState = function setState(newState) {
    state = newState;
  };
  var startDragging = function startDragging() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop$1;

    setState({
      isDragging: true
    });
    bindWindowEvents();
    fn();
  };
  var stopDragging = function stopDragging() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop$1;

    schedule.cancel();
    unbindWindowEvents();
    setState({ isDragging: false });
    fn();
  };
  var kill = function kill() {
    return stopDragging();
  };
  var cancel = function cancel() {
    stopDragging(callbacks.onCancel);
  };
  var isDragging = function isDragging() {
    return state.isDragging;
  };
  var schedule = createScheduler(callbacks);

  var onKeyDown = function onKeyDown(event, props) {
    var direction = props.direction;

    if (!isDragging()) {
      if (event.defaultPrevented) {
        return;
      }

      if (!canStartCapturing(event)) {
        return;
      }

      if (event.keyCode !== space) {
        return;
      }

      var ref = getDraggableRef();

      if (!ref) {
        console.error('cannot start a keyboard drag without a draggable ref');
        return;
      }

      var center = getBorderBoxCenterPosition(ref);

      event.preventDefault();
      startDragging(function () {
        return callbacks.onLift({
          client: center,
          autoScrollMode: 'JUMP'
        });
      });
      return;
    }

    if (event.keyCode === escape) {
      event.preventDefault();
      cancel();
      return;
    }

    if (event.keyCode === space) {
      event.preventDefault();
      stopDragging(callbacks.onDrop);
      return;
    }

    if (!direction) {
      console.error('Cannot handle keyboard movement event if direction is not provided');

      event.preventDefault();
      cancel();
      return;
    }

    var executeBasedOnDirection = function executeBasedOnDirection(fns) {
      if (direction === 'vertical') {
        fns.vertical();
        return;
      }
      fns.horizontal();
    };

    if (event.keyCode === arrowDown) {
      event.preventDefault();
      executeBasedOnDirection({
        vertical: schedule.moveForward,
        horizontal: schedule.crossAxisMoveForward
      });
      return;
    }

    if (event.keyCode === arrowUp) {
      event.preventDefault();
      executeBasedOnDirection({
        vertical: schedule.moveBackward,
        horizontal: schedule.crossAxisMoveBackward
      });
      return;
    }

    if (event.keyCode === arrowRight) {
      event.preventDefault();
      executeBasedOnDirection({
        vertical: schedule.crossAxisMoveForward,
        horizontal: schedule.moveForward
      });
      return;
    }

    if (event.keyCode === arrowLeft) {
      event.preventDefault();
      executeBasedOnDirection({
        vertical: schedule.crossAxisMoveBackward,
        horizontal: schedule.moveBackward
      });
    }

    if (scrollJumpKeys[event.keyCode]) {
      event.preventDefault();
      return;
    }

    preventStandardKeyEvents(event);
  };

  var windowBindings = [{
    eventName: 'mousedown',
    fn: cancel
  }, {
    eventName: 'mouseup',
    fn: cancel
  }, {
    eventName: 'click',
    fn: cancel
  }, {
    eventName: 'touchstart',
    fn: cancel
  }, {
    eventName: 'resize',
    fn: cancel
  }, {
    eventName: 'wheel',
    fn: cancel
  }, {
    eventName: 'scroll',

    options: { capture: false },
    fn: callbacks.onWindowScroll
  }, {
    eventName: supportedEventName,
    fn: cancel
  }];

  var bindWindowEvents = function bindWindowEvents() {
    bindEvents(getWindow(), windowBindings, { capture: true });
  };

  var unbindWindowEvents = function unbindWindowEvents() {
    unbindEvents(getWindow(), windowBindings, { capture: true });
  };

  var sensor = {
    onKeyDown: onKeyDown,
    kill: kill,
    isDragging: isDragging,

    isCapturing: isDragging,

    unmount: kill
  };

  return sensor;
});

var timeForLongPress = 150;
var forcePressThreshold = 0.15;
var touchStartMarshal = createEventMarshal();
var noop$2 = function noop() {};

var webkitHack = function () {
  var stub = {
    preventTouchMove: noop$2,
    releaseTouchMove: noop$2
  };

  if (typeof window === 'undefined') {
    return stub;
  }

  if (!('ontouchstart' in window)) {
    return stub;
  }

  var isBlocking = false;

  window.addEventListener('touchmove', function (event) {
    if (!isBlocking) {
      return;
    }

    if (event.defaultPrevented) {
      return;
    }

    event.preventDefault();
  }, { passive: false, capture: false });

  var preventTouchMove = function preventTouchMove() {
    isBlocking = true;
  };
  var releaseTouchMove = function releaseTouchMove() {
    isBlocking = false;
  };

  return { preventTouchMove: preventTouchMove, releaseTouchMove: releaseTouchMove };
}();

var initial = {
  isDragging: false,
  pending: null,
  hasMoved: false,
  longPressTimerId: null
};

var createTouchSensor = (function (_ref) {
  var callbacks = _ref.callbacks,
      getWindow = _ref.getWindow,
      canStartCapturing = _ref.canStartCapturing;

  var state = initial;

  var setState = function setState(partial) {
    state = _extends({}, state, partial);
  };
  var isDragging = function isDragging() {
    return state.isDragging;
  };
  var isCapturing = function isCapturing() {
    return Boolean(state.pending || state.isDragging || state.longPressTimerId);
  };
  var schedule = createScheduler(callbacks);
  var postDragEventPreventer = createPostDragEventPreventer(getWindow);

  var startDragging = function startDragging() {
    var pending = state.pending;

    if (!pending) {
      console.error('cannot start a touch drag without a pending position');
      kill();
      return;
    }

    setState({
      isDragging: true,

      hasMoved: false,

      pending: null,
      longPressTimerId: null
    });

    callbacks.onLift({
      client: pending,
      autoScrollMode: 'FLUID'
    });
  };
  var stopDragging = function stopDragging() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop$2;

    schedule.cancel();
    touchStartMarshal.reset();
    webkitHack.releaseTouchMove();
    unbindWindowEvents();
    postDragEventPreventer.preventNext();
    setState(initial);
    fn();
  };

  var startPendingDrag = function startPendingDrag(event) {
    var touch = event.touches[0];
    var clientX = touch.clientX,
        clientY = touch.clientY;

    var point = {
      x: clientX,
      y: clientY
    };

    var longPressTimerId = setTimeout(startDragging, timeForLongPress);

    setState({
      longPressTimerId: longPressTimerId,
      pending: point,
      isDragging: false,
      hasMoved: false
    });
    bindWindowEvents();
  };

  var stopPendingDrag = function stopPendingDrag() {
    if (state.longPressTimerId) {
      clearTimeout(state.longPressTimerId);
    }
    schedule.cancel();
    touchStartMarshal.reset();
    webkitHack.releaseTouchMove();
    unbindWindowEvents();

    setState(initial);
  };

  var kill = function kill() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop$2;

    if (state.pending) {
      stopPendingDrag();
      return;
    }
    stopDragging(fn);
  };

  var unmount = function unmount() {
    kill();
    postDragEventPreventer.abort();
  };

  var cancel = function cancel() {
    kill(callbacks.onCancel);
  };

  var windowBindings = [{
    eventName: 'touchmove',

    options: { passive: false },
    fn: function fn(event) {
      if (!state.isDragging) {
        stopPendingDrag();
        return;
      }

      if (!state.hasMoved) {
        setState({
          hasMoved: true
        });
      }

      var _event$touches$ = event.touches[0],
          clientX = _event$touches$.clientX,
          clientY = _event$touches$.clientY;


      var point = {
        x: clientX,
        y: clientY
      };

      event.preventDefault();
      schedule.move(point);
    }
  }, {
    eventName: 'touchend',
    fn: function fn(event) {
      if (!state.isDragging) {
        stopPendingDrag();
        return;
      }

      event.preventDefault();
      stopDragging(callbacks.onDrop);
    }
  }, {
    eventName: 'touchcancel',
    fn: function fn(event) {
      if (!state.isDragging) {
        stopPendingDrag();
        return;
      }

      event.preventDefault();
      stopDragging(callbacks.onCancel);
    }
  }, {
    eventName: 'touchstart',
    fn: cancel
  }, {
    eventName: 'orientationchange',
    fn: cancel
  }, {
    eventName: 'resize',
    fn: cancel
  }, {
    eventName: 'scroll',
    options: { passive: true, capture: false },
    fn: function fn() {
      if (state.pending) {
        stopPendingDrag();
        return;
      }
      schedule.windowScrollMove();
    }
  }, {
    eventName: 'contextmenu',
    fn: function fn(event) {
      event.preventDefault();
    }
  }, {
    eventName: 'keydown',
    fn: function fn(event) {
      if (!state.isDragging) {
        cancel();
        return;
      }

      if (event.keyCode === escape) {
        event.preventDefault();
      }
      cancel();
    }
  }, {
    eventName: 'touchforcechange',
    fn: function fn(event) {
      if (state.hasMoved) {
        event.preventDefault();
        return;
      }

      var touch = event.touches[0];

      if (touch.force >= forcePressThreshold) {
        cancel();
      }
    }
  }, {
    eventName: supportedEventName,
    fn: cancel
  }];

  var bindWindowEvents = function bindWindowEvents() {
    bindEvents(getWindow(), windowBindings, { capture: true });
  };

  var unbindWindowEvents = function unbindWindowEvents() {
    unbindEvents(getWindow(), windowBindings, { capture: true });
  };

  var onTouchStart = function onTouchStart(event) {
    if (touchStartMarshal.isHandled()) {
      return;
    }

    if (!canStartCapturing(event)) {
      return;
    }

    if (isCapturing()) {
      console.error('should not be able to perform a touch start while a drag or pending drag is occurring');
      cancel();
      return;
    }

    touchStartMarshal.handle();

    webkitHack.preventTouchMove();
    startPendingDrag(event);
  };

  var sensor = {
    onTouchStart: onTouchStart,
    kill: kill,
    isCapturing: isCapturing,
    isDragging: isDragging,
    unmount: unmount
  };

  return sensor;
});

var _DragHandle$contextTy;

var preventHtml5Dnd = function preventHtml5Dnd(event) {
  event.preventDefault();
};

var DragHandle = function (_Component) {
  _inherits(DragHandle, _Component);

  function DragHandle(props, context) {
    _classCallCheck(this, DragHandle);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.isFocused = false;

    _this.onFocus = function () {
      _this.isFocused = true;
    };

    _this.onBlur = function () {
      _this.isFocused = false;
    };

    _this.onKeyDown = function (event) {
      if (_this.mouseSensor.isCapturing()) {
        return;
      }

      _this.keyboardSensor.onKeyDown(event, _this.props);
    };

    _this.onMouseDown = function (event) {
      if (_this.keyboardSensor.isCapturing() || _this.mouseSensor.isCapturing()) {
        return;
      }

      _this.mouseSensor.onMouseDown(event);
    };

    _this.onTouchStart = function (event) {
      if (_this.mouseSensor.isCapturing() || _this.keyboardSensor.isCapturing()) {
        console.error('mouse or keyboard already listening when attempting to touch drag');
        return;
      }

      _this.touchSensor.onTouchStart(event);
    };

    _this.canStartCapturing = function (event) {
      if (_this.isAnySensorCapturing()) {
        return false;
      }

      if (!_this.canLift(_this.props.draggableId)) {
        return false;
      }

      return shouldAllowDraggingFromTarget(event, _this.props);
    };

    _this.isAnySensorCapturing = function () {
      return _this.sensors.some(function (sensor) {
        return sensor.isCapturing();
      });
    };

    _this.getProvided = memoizeOne(function (isEnabled) {
      if (!isEnabled) {
        return null;
      }

      var provided = {
        onMouseDown: _this.onMouseDown,
        onKeyDown: _this.onKeyDown,
        onTouchStart: _this.onTouchStart,
        onFocus: _this.onFocus,
        onBlur: _this.onBlur,
        tabIndex: 0,
        'data-react-beautiful-dnd-drag-handle': _this.styleContext,

        'aria-roledescription': 'Draggable item. Press space bar to lift',
        draggable: false,
        onDragStart: preventHtml5Dnd
      };

      return provided;
    });


    var getWindow = function getWindow() {
      return getWindowFromRef(_this.props.getDraggableRef());
    };

    var args = {
      callbacks: _this.props.callbacks,
      getDraggableRef: _this.props.getDraggableRef,
      getWindow: getWindow,
      canStartCapturing: _this.canStartCapturing
    };

    _this.mouseSensor = createMouseSensor(args);
    _this.keyboardSensor = createKeyboardSensor(args);
    _this.touchSensor = createTouchSensor(args);
    _this.sensors = [_this.mouseSensor, _this.keyboardSensor, _this.touchSensor];
    _this.styleContext = context[styleContextKey];

    _this.canLift = context[canLiftContextKey];
    return _this;
  }

  DragHandle.prototype.componentDidMount = function componentDidMount() {
    var draggableRef = this.props.getDraggableRef();

    this.lastDraggableRef = draggableRef;

    if (!draggableRef) {
      console.error('Cannot get draggable ref from drag handle');
      return;
    }

    if (!this.props.isEnabled) {
      return;
    }

    var dragHandleRef = getDragHandleRef(draggableRef);
    invariant(dragHandleRef, 'DragHandle could not find drag handle element');

    retainer.tryRestoreFocus(this.props.draggableId, dragHandleRef);
  };

  DragHandle.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    var _this2 = this;

    var ref = this.props.getDraggableRef();
    if (ref !== this.lastDraggableRef) {
      this.lastDraggableRef = ref;

      if (!ref || !this.isFocused) {
        return;
      }

      if (!this.props.isEnabled) {
        return;
      }

      var dragHandleRef = getDragHandleRef(ref);
      invariant(dragHandleRef, 'DragHandle could not find drag handle element');

      dragHandleRef.focus();
    }

    var isCapturing = this.isAnySensorCapturing();

    if (!isCapturing) {
      return;
    }

    var isDragStopping = prevProps.isDragging && !this.props.isDragging;

    if (isDragStopping) {
      this.sensors.forEach(function (sensor) {
        if (sensor.isCapturing()) {
          sensor.kill();
        }
      });
      return;
    }

    if (!this.props.isEnabled) {
      this.sensors.forEach(function (sensor) {
        if (sensor.isCapturing()) {
          var wasDragging = sensor.isDragging();

          sensor.kill();

          if (wasDragging) {
            _this2.props.callbacks.onCancel();
          }
        }
      });
    }
  };

  DragHandle.prototype.componentWillUnmount = function componentWillUnmount() {
    var _this3 = this;

    this.sensors.forEach(function (sensor) {
      var wasDragging = sensor.isDragging();

      sensor.unmount();

      if (wasDragging) {
        _this3.props.callbacks.onCancel();
      }
    });

    var shouldRetainFocus = function () {
      if (!_this3.props.isEnabled) {
        return false;
      }

      if (!_this3.isFocused) {
        return false;
      }

      return _this3.props.isDragging || _this3.props.isDropAnimating;
    }();

    if (shouldRetainFocus) {
      retainer.retain(this.props.draggableId);
    }
  };

  DragHandle.prototype.render = function render() {
    var _props = this.props,
        children = _props.children,
        isEnabled = _props.isEnabled;


    return children(this.getProvided(isEnabled));
  };

  return DragHandle;
}(Component);

DragHandle.contextTypes = (_DragHandle$contextTy = {}, _DragHandle$contextTy[styleContextKey] = PropTypes.string.isRequired, _DragHandle$contextTy[canLiftContextKey] = PropTypes.func.isRequired, _DragHandle$contextTy);

var getViewport = (function () {
  var scroll = getWindowScroll();

  var top = scroll.y;
  var left = scroll.x;

  var doc = document.documentElement;

  invariant(doc, 'Could not find document.documentElement');

  var width = doc.clientWidth;
  var height = doc.clientHeight;

  var right = left + width;
  var bottom = top + height;

  var subject = getRect({
    top: top, left: left, right: right, bottom: bottom
  });

  var maxScroll = getMaxScroll({
    scrollHeight: doc.scrollHeight,
    scrollWidth: doc.scrollWidth,
    width: subject.width,
    height: subject.height
  });

  var viewport = {
    subject: subject,
    maxScroll: maxScroll,
    scroll: scroll
  };

  return viewport;
});

var _Draggable$contextTyp;


var zIndexOptions = {
  dragging: 5000,
  dropAnimating: 4500
};

var Draggable = function (_Component) {
  _inherits(Draggable, _Component);

  function Draggable(props, context) {
    _classCallCheck(this, Draggable);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.ref = null;

    _this.onMoveEnd = function () {
      if (!_this.props.isDropAnimating) {
        return;
      }

      _this.props.dropAnimationFinished();
    };

    _this.onLift = function (options) {
      start('LIFT');
      _this.throwIfCannotDrag();
      var client = options.client,
          autoScrollMode = options.autoScrollMode;
      var _this$props = _this.props,
          lift = _this$props.lift,
          draggableId = _this$props.draggableId;

      var ref = _this.ref;

      invariant(ref, 'Cannot lift at this time as there is no ref');

      var initial = {
        selection: client,
        borderBoxCenter: getBorderBoxCenterPosition(ref)
      };

      lift(draggableId, initial, getViewport(), autoScrollMode);
    };

    _this.onMove = function (client) {
      _this.throwIfCannotDrag();

      var _this$props2 = _this.props,
          draggableId = _this$props2.draggableId,
          dimension = _this$props2.dimension,
          move = _this$props2.move;

      if (!dimension) {
        return;
      }

      move(draggableId, client, getViewport());
    };

    _this.onMoveForward = function () {
      _this.throwIfCannotDrag();
      _this.props.moveForward(_this.props.draggableId);
    };

    _this.onMoveBackward = function () {
      _this.throwIfCannotDrag();
      _this.props.moveBackward(_this.props.draggableId);
    };

    _this.onCrossAxisMoveForward = function () {
      _this.throwIfCannotDrag();
      _this.props.crossAxisMoveForward(_this.props.draggableId);
    };

    _this.onCrossAxisMoveBackward = function () {
      _this.throwIfCannotDrag();
      _this.props.crossAxisMoveBackward(_this.props.draggableId);
    };

    _this.onWindowScroll = function () {
      _this.throwIfCannotDrag();
      _this.props.moveByWindowScroll(_this.props.draggableId, getViewport());
    };

    _this.onDrop = function () {
      _this.throwIfCannotDrag();
      _this.props.drop();
    };

    _this.onCancel = function () {
      _this.props.cancel();
    };

    _this.setRef = function (ref) {
      if (ref === null) {
        return;
      }

      if (ref === _this.ref) {
        return;
      }

      _this.ref = ref;
    };

    _this.getDraggableRef = function () {
      return _this.ref;
    };

    _this.getDraggingStyle = memoizeOne(function (dimension, isDropAnimating, movementStyle) {
      var _dimension$client$bor = dimension.client.borderBox,
          width = _dimension$client$bor.width,
          height = _dimension$client$bor.height,
          top = _dimension$client$bor.top,
          left = _dimension$client$bor.left;

      var style = {
        position: 'fixed',
        boxSizing: 'border-box',
        zIndex: isDropAnimating ? zIndexOptions.dropAnimating : zIndexOptions.dragging,
        width: width,
        height: height,
        top: top,
        left: left,
        margin: 0,
        pointerEvents: 'none',
        transition: 'none',
        transform: movementStyle.transform ? '' + movementStyle.transform : null
      };
      return style;
    });
    _this.getNotDraggingStyle = memoizeOne(function (movementStyle, shouldAnimateDisplacement) {
      var style = {
        transform: movementStyle.transform,

        transition: shouldAnimateDisplacement ? null : 'none'
      };
      return style;
    });
    _this.getProvided = memoizeOne(function (isDragging, isDropAnimating, shouldAnimateDisplacement, dimension, dragHandleProps, movementStyle) {
      var useDraggingStyle = isDragging || isDropAnimating;

      var draggableStyle = function () {
        if (!useDraggingStyle) {
          return _this.getNotDraggingStyle(movementStyle, shouldAnimateDisplacement);
        }

        invariant(dimension, 'draggable dimension required for dragging');

        return _this.getDraggingStyle(dimension, isDropAnimating, movementStyle);
      }();

      var provided = {
        innerRef: _this.setRef,
        draggableProps: {
          'data-react-beautiful-dnd-draggable': _this.styleContext,
          style: draggableStyle
        },
        dragHandleProps: dragHandleProps
      };
      return provided;
    });
    _this.getSnapshot = memoizeOne(function (isDragging, isDropAnimating, draggingOver) {
      return {
        isDragging: isDragging || isDropAnimating,
        draggingOver: draggingOver
      };
    });
    _this.getSpeed = memoizeOne(function (isDragging, shouldAnimateDragMovement, isDropAnimating) {
      if (isDropAnimating) {
        return 'STANDARD';
      }

      if (isDragging && shouldAnimateDragMovement) {
        return 'FAST';
      }

      return 'INSTANT';
    });

    _this.renderChildren = function (movementStyle, dragHandleProps) {
      var _this$props3 = _this.props,
          isDragging = _this$props3.isDragging,
          isDropAnimating = _this$props3.isDropAnimating,
          dimension = _this$props3.dimension,
          draggingOver = _this$props3.draggingOver,
          shouldAnimateDisplacement = _this$props3.shouldAnimateDisplacement,
          children = _this$props3.children;


      var child = children(_this.getProvided(isDragging, isDropAnimating, shouldAnimateDisplacement, dimension, dragHandleProps, movementStyle), _this.getSnapshot(isDragging, isDropAnimating, draggingOver));

      var isDraggingOrDropping = isDragging || isDropAnimating;

      var placeholder = function () {
        if (!isDraggingOrDropping) {
          return null;
        }

        if (!dimension) {
          console.error('Draggable: Dimension is required for dragging');
          return null;
        }

        return React.createElement(Placeholder, { placeholder: dimension.placeholder });
      }();

      return React.createElement(
        Fragment,
        null,
        child,
        placeholder
      );
    };

    var callbacks = {
      onLift: _this.onLift,
      onMove: _this.onMove,
      onDrop: _this.onDrop,
      onCancel: _this.onCancel,
      onMoveBackward: _this.onMoveBackward,
      onMoveForward: _this.onMoveForward,
      onCrossAxisMoveForward: _this.onCrossAxisMoveForward,
      onCrossAxisMoveBackward: _this.onCrossAxisMoveBackward,
      onWindowScroll: _this.onWindowScroll
    };

    _this.callbacks = callbacks;
    _this.styleContext = context[styleContextKey];
    return _this;
  }

  Draggable.prototype.componentDidMount = function componentDidMount() {
    if (!this.ref) {
      console.error('\n        Draggable has not been provided with a ref.\n        Please use the DraggableProvided > innerRef function\n      ');
    }
  };

  Draggable.prototype.componentWillUnmount = function componentWillUnmount() {
    this.ref = null;
  };

  Draggable.prototype.throwIfCannotDrag = function throwIfCannotDrag() {
    invariant(this.ref, '\n      Draggable: cannot drag as no DOM node has been provided\n      Please ensure you provide a DOM node using the DraggableProvided > innerRef function\n    ');
    invariant(!this.props.isDragDisabled, 'Draggable: cannot drag as dragging is not enabled');
  };

  Draggable.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        draggableId = _props.draggableId,
        index = _props.index,
        offset = _props.offset,
        isDragging = _props.isDragging,
        isDropAnimating = _props.isDropAnimating,
        isDragDisabled = _props.isDragDisabled,
        direction = _props.direction,
        shouldAnimateDragMovement = _props.shouldAnimateDragMovement,
        disableInteractiveElementBlocking = _props.disableInteractiveElementBlocking;

    var droppableId = this.context[droppableIdKey];

    var speed = this.getSpeed(isDragging, shouldAnimateDragMovement, isDropAnimating);

    return React.createElement(
      DraggableDimensionPublisher,
      {
        key: draggableId,
        draggableId: draggableId,
        droppableId: droppableId,
        index: index,
        getDraggableRef: this.getDraggableRef
      },
      React.createElement(
        Movable,
        {
          speed: speed,
          destination: offset,
          onMoveEnd: this.onMoveEnd
        },
        function (movementStyle) {
          return React.createElement(
            DragHandle,
            {
              draggableId: draggableId,
              isDragging: isDragging,
              isDropAnimating: isDropAnimating,
              direction: direction,
              isEnabled: !isDragDisabled,
              callbacks: _this2.callbacks,
              getDraggableRef: _this2.getDraggableRef,

              canDragInteractiveElements: disableInteractiveElementBlocking
            },
            function (dragHandleProps) {
              return _this2.renderChildren(movementStyle, dragHandleProps);
            }
          );
        }
      )
    );
  };

  return Draggable;
}(Component);

Draggable.contextTypes = (_Draggable$contextTyp = {}, _Draggable$contextTyp[droppableIdKey] = PropTypes.string.isRequired, _Draggable$contextTyp[styleContextKey] = PropTypes.string.isRequired, _Draggable$contextTyp);

var origin$9 = { x: 0, y: 0 };

var defaultMapProps = {
  isDropAnimating: false,
  isDragging: false,
  offset: origin$9,
  shouldAnimateDragMovement: false,

  shouldAnimateDisplacement: true,

  dimension: null,
  direction: null,
  draggingOver: null
};

var makeSelector$1 = function makeSelector() {
  var memoizedOffset = memoizeOne(function (x, y) {
    return {
      x: x, y: y
    };
  });

  var getNotDraggingProps = memoizeOne(function (offset, shouldAnimateDisplacement) {
    return {
      isDropAnimating: false,
      isDragging: false,
      offset: offset,
      shouldAnimateDisplacement: shouldAnimateDisplacement,

      shouldAnimateDragMovement: false,
      dimension: null,
      direction: null,
      draggingOver: null
    };
  });

  var getDraggingProps = memoizeOne(function (offset, shouldAnimateDragMovement, dimension, direction, draggingOver) {
    return {
      isDragging: true,
      isDropAnimating: false,
      shouldAnimateDisplacement: false,
      offset: offset,
      shouldAnimateDragMovement: shouldAnimateDragMovement,
      dimension: dimension,
      direction: direction,
      draggingOver: draggingOver
    };
  });

  var draggingSelector = function draggingSelector(state, ownProps) {
    if (state.phase !== 'DRAGGING' && state.phase !== 'DROP_ANIMATING') {
      return null;
    }

    if (state.phase === 'DRAGGING') {
      var drag = state.drag;
      if (!drag) {
        console.error('invalid drag state found in selector');
        return null;
      }

      if (drag.initial.descriptor.id !== ownProps.draggableId) {
        return null;
      }

      var offset = drag.current.client.offset;
      var dimension = state.dimension.draggable[ownProps.draggableId];
      var _direction = function () {
        if (drag.impact.direction) {
          return drag.impact.direction;
        }

        var home = state.dimension.droppable[drag.initial.descriptor.droppableId];
        return home.axis.direction;
      }();
      var shouldAnimateDragMovement = drag.current.shouldAnimate;
      var _draggingOver = drag.impact.destination ? drag.impact.destination.droppableId : null;

      return getDraggingProps(memoizedOffset(offset.x, offset.y), shouldAnimateDragMovement, dimension, _direction, _draggingOver);
    }

    var pending = state.drop && state.drop.pending;

    if (!pending) {
      console.error('cannot provide props for dropping item when there is invalid state');
      return null;
    }

    if (pending.result.draggableId !== ownProps.draggableId) {
      return null;
    }

    var draggingOver = pending.result.destination ? pending.result.destination.droppableId : null;
    var direction = pending.impact.direction ? pending.impact.direction : null;

    return {
      isDragging: false,
      isDropAnimating: true,
      offset: pending.newHomeOffset,

      dimension: state.dimension.draggable[ownProps.draggableId],
      draggingOver: draggingOver,
      direction: direction,

      shouldAnimateDragMovement: false,

      shouldAnimateDisplacement: false
    };
  };

  var getOutOfTheWayMovement = function getOutOfTheWayMovement(id, movement) {
    var map = getDisplacementMap(movement.displaced);
    var displacement = map[id];

    if (!displacement) {
      return null;
    }

    if (!displacement.isVisible) {
      return null;
    }

    var amount = movement.isBeyondStartPosition ? negate(movement.amount) : movement.amount;

    return getNotDraggingProps(memoizedOffset(amount.x, amount.y), displacement.shouldAnimate);
  };

  var movingOutOfTheWaySelector = function movingOutOfTheWaySelector(state, ownProps) {
    if (state.phase !== 'DRAGGING' && state.phase !== 'DROP_ANIMATING') {
      return null;
    }

    if (state.phase === 'DRAGGING') {
      if (!state.drag) {
        console.error('cannot correctly move item out of the way when there is invalid state');
        return null;
      }

      if (state.drag.initial.descriptor.id === ownProps.draggableId) {
        return null;
      }

      return getOutOfTheWayMovement(ownProps.draggableId, state.drag.impact.movement);
    }

    if (!state.drop || !state.drop.pending) {
      console.error('cannot provide props for dropping item when there is invalid state');
      return null;
    }

    if (state.drop.pending.result.draggableId === ownProps.draggableId) {
      return null;
    }

    return getOutOfTheWayMovement(ownProps.draggableId, state.drop.pending.impact.movement);
  };

  return createSelector([draggingSelector, movingOutOfTheWaySelector], function (dragging, movingOutOfTheWay) {
    if (dragging) {
      return dragging;
    }

    if (movingOutOfTheWay) {
      return movingOutOfTheWay;
    }

    return defaultMapProps;
  });
};

var makeMapStateToProps$1 = function makeMapStateToProps() {
  var selector = makeSelector$1();
  return function (state, props) {
    return selector(state, props);
  };
};

var mapDispatchToProps = {
  lift: lift,
  move: move$1,
  moveForward: moveForward,
  moveBackward: moveBackward,
  crossAxisMoveForward: crossAxisMoveForward,
  crossAxisMoveBackward: crossAxisMoveBackward,
  moveByWindowScroll: moveByWindowScroll,
  drop: drop,
  dropAnimationFinished: dropAnimationFinished,
  cancel: cancel
};

var ConnectedDraggable = connect(makeMapStateToProps$1, mapDispatchToProps, null, { storeKey: storeKey })(Draggable);

ConnectedDraggable.defaultProps = {
  isDragDisabled: false,

  disableInteractiveElementBlocking: false
};

export { DragDropContext, connectedDroppable as Droppable, ConnectedDraggable as Draggable, resetServerContext };
