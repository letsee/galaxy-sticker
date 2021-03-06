window.addEventListener("touchstart", touchDown);
window.addEventListener("touchend", touchUp);
window.addEventListener("touchmove", touchMove);

let manager = new Hammer(document.body);
manager.get("pinch").set({ enable: true });
manager.get("pan").set({ enable: true, direction: Hammer.DIRECTION_ALL });
manager.get("rotate").set({ enable: true });
manager.get("press").set({ enable: true, time: 1000, threshold: 15 });
manager.get("tap").set({ enable: true });

let touch = {
  current: {
    x: 0,
    y: 0,
    z: 0,
    scale: 1,
    rotation: 0,
  },
  OLD_ROTATE_Z: null,
  move: {
    x: 0,
    y: 0,
  },
  delta: {
    x: 0,
    y: 0,
  },
  press: false,
  helper: null,
  gestureF3: {
    enable: false,
    count: 0,
  },
  isBoundary: false,
};

manager.on("panmove", function (e) {
  if (touch.gestureF3.enable) return;
  if (!editObject) return;
  if (touch.isBoundary) return;

  /*if (
      currentTarget.size.width * 2 < editObject.position.x ||
      -currentTarget.size.width * 2 > editObject.position.x
  ) {
    editObject.position.x =
        editObject.position.x > 0
            ? currentTarget.size.width * 2 - 1
            : -(currentTarget.size.width * 2 - 1);

    touch.current.x = editObject.position.x;
    touch.current.y = -editObject.position.y;
    touch.isBoundary = true;
    return;
  }
  if (
      currentTarget.size.height * 2 < editObject.position.y ||
      -currentTarget.size.height * 2 > editObject.position.y
  ) {
    editObject.position.y =
        editObject.position.y > 0
            ? currentTarget.size.height * 2 - 1
            : -(currentTarget.size.height * 2 - 1);

    touch.current.x = editObject.position.x;
    touch.current.y = -editObject.position.y;
    touch.isBoundary = true;
    return;
  }*/

  if (touch.press) {
    const dZ = touch.current.z + e.deltaY / 4;

    editObject.position.z = -dZ;
    touch.helper.position.z = editObject.position.z - 0;
  } else {
    const dX = touch.current.x + e.deltaX * 2;
    const dY = touch.current.y + e.deltaY * 2;

    editObject.position.x = dX;
    editObject.position.y = -dY;
  }
});

manager.on("panend", function (e) {
  if (touch.gestureF3.enable) return;
  if (!editObject) return;

  if (touch.isBoundary) touch.isBoundary = false;
  else {
    if (touch.press) {
      touch.press = false;
      // world.remove(touch.helper);

      touch.current.z = touch.current.z + e.deltaY / 4;
      manager.get("pinch").set({ enable: true });
      // manager.get("rotate").set({ enable: true });
      manager.get("rotate").set({ enable: false });
    } else {
      touch.current.x = touch.current.x + e.deltaX * 2;
      touch.current.y = touch.current.y + e.deltaY * 2;
    }
  }
});

manager.on("pinchmove", function (e) {
  if (touch.gestureF3.enable) return;
  if (!editObject) return;

  if (touch.isBoundary) return;

  /*if (
      currentTarget.size.width * 2 < editObject.position.x ||
      -currentTarget.size.width * 2 > editObject.position.x
  ) {
    editObject.position.x =
        editObject.position.x > 0
            ? currentTarget.size.width * 2 - 1
            : -(currentTarget.size.width * 2 - 1);

    touch.current.x = editObject.position.x;
    touch.current.y = -editObject.position.y;
    touch.isBoundary = true;
    return;
  }
  if (
      currentTarget.size.height * 2 < editObject.position.y ||
      -currentTarget.size.height * 2 > editObject.position.y
  ) {
    editObject.position.y =
        editObject.position.y > 0
            ? currentTarget.size.height * 2 - 1
            : -(currentTarget.size.height * 2 - 1);

    touch.current.x = editObject.position.x;
    touch.current.y = -editObject.position.y;
    touch.isBoundary = true;
    return;
  }*/

  const scale = e.scale * touch.current.scale;
  // var scale = (e.scale-(e.scale/2)) * touch.current.scale;

  editObject.scale.set(scale, scale, scale);

  const dX = touch.current.x + e.deltaX * 2;
  const dY = touch.current.y + e.deltaY * 2;

  editObject.position.x = dX;
  editObject.position.y = dY;
});

manager.on("pinchend", function (e) {
  if (touch.gestureF3.enable) return;
  if (!editObject) return;
  if (touch.isBoundary) touch.isBoundary = false;

  touch.current.scale = e.scale * touch.current.scale;
  // touch.current.scale = (e.scale-(e.scale/2)) * touch.current.scale;
});

manager.on("rotatemove", function (e) {
  if (touch.gestureF3.enable) return;
  if (!editObject) return;

  if (touch.OLD_ROTATE_Z) {
    // editObject.rotateZ((touch.OLD_ROTATE_Z - -e.rotation) / 60);
    editObject.rotateZ(-(touch.OLD_ROTATE_Z - -e.rotation) / 30);
  }
  touch.OLD_ROTATE_Z = -e.rotation;
});

manager.on("rotateend", function (e) {
  if (touch.gestureF3.enable) return;
  if (!editObject) return;

  touch.OLD_ROTATE_Z = null;
});

manager.on("pressup", function (e) {
  if (touch.gestureF3.enable) return;
  if (touch.press) {
    touch.press = false;
    // world.remove(touch.helper);
  }
});

/*manager.on("press", function (e) {
  if (touch.gestureF3.enable) return;
  if (!editObject) return;

  touch.press = true;

  const helpElement = document.createElement("div");
  helpElement.innerHTML = '<img style="" src="assets/idc-zpos.png" srcset="assets/idc-zpos@2x.png 2x, assets/idc-zpos@3x.png 3x">';

  // touch.helper = new DOMRenderable(helpElement);
  touch.helper = letsee.addXRElement(helpElement.innerHTML, letsee.getEntityByUri('lemona.json'));

  const scale = editObject.scale.x / 0.9;
  touch.helper.scale.set(scale, scale, scale);

  touch.helper.position.x = editObject.position.x;
  touch.helper.position.y = editObject.position.y - scale * 35;
  touch.helper.position.z = editObject.position.z - 0;

  touch.helper.rotateX(Math.PI / 2);

  // world.add(touch.helper);
  manager.get("pinch").set({ enable: false });
  manager.get("rotate").set({ enable: false });
});*/

// 3F
function touchMove(e) {
  if (!editObject) return;

  if (e.touches.length > 2) {
    if (!touch.gestureF3.enable) return;

    const speed = 0.01;

    const x = e.touches[1].pageX - touch.move.x,
      y = e.touches[1].pageY - touch.move.y;

    const mX = new Matrix4(),
      mY = new Matrix4();

    mX.makeRotationX(y * speed);
    mY.makeRotationY(x * speed);

    const m = new Matrix4(),
      mQ = new Quaternion();

    m.multiplyMatrices(mX, mY);
    mQ.setFromRotationMatrix(m);

    mQ.multiply(editObject.quaternion);

    editObject.quaternion.copy(mQ);

    touch.move.x = e.touches[1].pageX;
    touch.move.y = e.touches[1].pageY;
  }
}

function touchDown(e) {
  if (!editObject) return;

  if (e.touches.length > 2) {
    touch.gestureF3.enable = true;

    manager.get("pan").set({ enable: false });
    manager.get("pinch").set({ enable: false });
    manager.get("rotate").set({ enable: false });

    touch.move.x = e.touches[1].pageX;
    touch.move.y = e.touches[1].pageY;
  }
}

function touchUp(e) {
  if (!editObject) return;

  if (touch.gestureF3.enable) touch.gestureF3.count++;

  if (touch.gestureF3.count === 3) {
    manager.get("pan").set({ enable: true });
    manager.get("pinch").set({ enable: true });
    // manager.get("rotate").set({ enable: true });
    manager.get("rotate").set({ enable: false });
    touch.gestureF3.count = 0;
    touch.gestureF3.enable = false;
  }
}