      var scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

      var camera =  new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000);

      var renderer = new THREE.WebGLRenderer();
      renderer.setClearColor( scene.fog.color );
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild( renderer.domElement );
      var  controls = new THREE.OrbitControls( camera, renderer.domElement );
        //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = false;

      var particle_sphere = new THREE.SphereGeometry(1); 
      var particle_material = new THREE.MeshBasicMaterial({color: 0x66ffcc});
      var particle = new THREE.Mesh(particle_sphere, particle_material);
      

      var p = new THREE.Object3D();
      p.add(particle);
      
      function Particle(velocity, mass, charge, geometry) {
          this.velocity = velocity;
          this.mass = mass;
          this.charge = charge;
          this.geometry = geometry;

      }

      var p1 = new Particle(new THREE.Vector3(0,0,0), 104, 0.1, new THREE.Object3D());
      p1.geometry.add(new THREE.Mesh(particle_sphere, particle_material));
      p1.geometry.position.set(1, 1, 0);
      var p2 = new Particle(new THREE.Vector3(0,0,0), 104, 0.1, new THREE.Object3D());
      p2.geometry.add(new THREE.Mesh(particle_sphere, particle_material));
      p2.geometry.position.set(-5,-5,0);
      var p3 = new Particle(new THREE.Vector3(0,0,0), 104, -5, new THREE.Object3D());
      p3.geometry.add(new THREE.Mesh(particle_sphere, particle_material));
      p3.geometry.position.set(-15,20,5);
      var particles = [p1, p2, p3];
   
      function init() {
        for (var i = 0; i < particles.length; i++ ){
          var geo = particles[i].geometry;
          scene.add(geo);

        }
      } 


      
      var unit_vectors = [new THREE.Vector3(1,0,0),new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,1)];
      var length = 2;
      var origin = new THREE.Vector3(-5,0,0);
      var hex = [0xffff00, 0x00ced1, 0xdd0a2b]; // yellow (x) blue (y) red (z)

      for (var i = 0; i < unit_vectors.length; i++) {
        var arrowHelper = new THREE.ArrowHelper(unit_vectors[i], origin, length, hex[i]);
        scene.add(arrowHelper);
      }

      camera.position.z = 10;

      function applyElectricField(target_particle, sources) {
        var E_vec = new THREE.Vector3(0, 0 , 0);
        for (var i = 0; i < particles.length; i++) {
          if (particles[i] != target_particle) {
            var tp = new THREE.Vector3(); 
            tp.copy(target_particle.geometry.position).sub(particles[i].geometry.position);
            console.log(tp);
            var tph = new THREE.Vector3();
            tph.copy(tp).normalize();

            var e = tph.multiplyScalar(980*particles[i].charge/(tp.length()*tp.length()));

            E_vec.add(e);

          }
        }

        return E_vec;
      }

      function updateForce(frame_rate) {
        for (var n = 0; n < particles.length; n++) {
          var E_vec = applyElectricField(particles[n], particles);
          var accel = E_vec.multiplyScalar(particles[n].charge/(particles[n].mass*frame_rate));
          particles[n].velocity.add(accel);
          console.log(particles[n].velocity);
          particles[n].geometry.position.add(particles[n].velocity);
        }
      }

      function render() {
        requestAnimationFrame( render );
        updateForce(60);
        renderer.render( scene, camera ); 
      }
      init();
      render();