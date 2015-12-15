      var scene = new THREE.Scene();
      var camera =  new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000);

      var renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild( renderer.domElement );


      var m = 1; // 1kg mass 

      var particle_sphere = new THREE.SphereGeometry(1); 
      var particle_material = new THREE.MeshBasicMaterial({color: 0x66ffcc});
      var particle = new THREE.Mesh(particle_sphere, particle_material);
      

      var p = new THREE.Object3D();
      p.add(particle);
      p.position = new THREE.Vector3(1,1,1);

      var velocity = new THREE.Vector3(0,0,0);
      var particles = [p];

      function init() {
        for (var i = 0; i < particles.length; i++ ){
          scene.add(particles[i]);
        }
      } 


      
      var unit_vectors = [new THREE.Vector3(1,0,0),new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,1)];
      var length = 2;
      var origin = new THREE.Vector3(-5,0,0);
      var hex = 0xffff00;

      for (var i = 0; i < unit_vectors.length; i++) {
        var arrowHelper = new THREE.ArrowHelper(unit_vectors[i], origin, length, hex);
        scene.add(arrowHelper);
      }

      camera.position.z = 10;

      function applyElectricField(target_particle, sources) {
        var E_Vec = new THREE.Vector3(.0001, 0, 0);
        return E_Vec;
      }

      function updateForce() {
        for (var n = 0; n < particles.length; n++) {
          var E_Vec = applyElectricField(particles[n], particles);
          velocity.add(E_Vec);
          particles[n].position.add(velocity);
          console.log(particles[n].position);
        }
      }

      function render() {
        requestAnimationFrame( render );
        updateForce();
        renderer.render( scene, camera ); 
      }
      init();
      render();