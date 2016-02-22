var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0xcccccc, 0);

var camera =  new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 10;



var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var  controls = new THREE.OrbitControls( camera, renderer.domElement );
  //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = false;

var domEvents   = new THREEx.DomEvents(camera, renderer.domElement)

var e_hover = new THREE.ArrowHelper(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0), 1, 0x00ced1);


// Setting up basic geometry for a unit sphere 
var particle_sphere = new THREE.SphereGeometry(1); 
var particle_material = new THREE.MeshBasicMaterial({color: 0x66ffcc});
var particle_material2 = new THREE.MeshBasicMaterial({color: 0x66ff00});

var particle = new THREE.Mesh(particle_sphere, particle_material);

var fixed_sphere = new THREE.SphereGeometry(5); 



var p1 = new Particle(new THREE.Vector3(0,0,0), 1, 1, new THREE.Object3D());
p1.geometry.add(new THREE.Mesh(particle_sphere, particle_material));
p1.geometry.position.set(0, 0, 0);

 var p2 = new Particle(new THREE.Vector3(0,0,0), -1, .01, new THREE.Object3D());
p2.geometry.add(new THREE.Mesh(particle_sphere, particle_material2));
p2.geometry.position.set(5,5,0);


 var p3 = new Particle(new THREE.Vector3(0,0,0), -1, .01, new THREE.Object3D());
p3.geometry.add(new THREE.Mesh(particle_sphere, particle_material));
p3.geometry.position.set(-15,20,5);

var p4 = new Particle(new THREE.Vector3(0,0,0), 1, .01, new THREE.Object3D());
p4.geometry.add(new THREE.Mesh(particle_sphere, particle_material));
p4.geometry.position.set(20,20,10);      




var particles = [p1, p2]; 



function init() {
  for (var i = 0; i < particles.length; i++ ){
    var geo = particles[i].geometry;
    domEvents.addEventListener(geo, 'mouseover', function(event){
      updateArrowHelper(e_hover, particles[i].geometry.position, 
        findElectricField(particles[i].geometry.position,  particles), 10);
    }, false);

    scene.add(geo);

  }
} 





function render() {
  requestAnimationFrame( render );  
  updateForce(60000000000);
  renderer.render( scene, camera ); 
}
init();
render();