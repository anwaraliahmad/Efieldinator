
// Unit vectors for each axis

var unit_vectors = [new THREE.Vector3(1,0,0),new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,1)];
var length = 2;
var origin = new THREE.Vector3(0,0,0);
var hex = [0xffff00, 0x00ced1, 0xdd0a2b]; // yellow (x) blue (y) red (z)

for (var i = 0; i < unit_vectors.length; i++) {
  var arrowHelper = new THREE.ArrowHelper(unit_vectors[i], origin, length, hex[i]);
  scene.add(arrowHelper);
}



function updateArrowHelper(arrow_helper, pos, dir, length) {
  arrow_helper.position.set(pos);
  arrow_helper.setDirection(dir);
  arrow_helper.setLength(length);
}

