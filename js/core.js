      var scene = new THREE.Scene();
      var camera =  new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000);

      var renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild( renderer.domElement );


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

      var p1 = new Particle(new THREE.Vector3(0,0,0), 104, 20, new THREE.Object3D());
      p1.geometry.add(new THREE.Mesh(particle_sphere, particle_material));
      p1.geometry.position.set(100, 100,400000);
      var p2 = new Particle(new THREE.Vector3(0,0,0), 104, 20, new THREE.Object3D());
      p2.geometry.add(new THREE.Mesh(particle_sphere, particle_material));
      p2.geometry.position.set(100,100,1000);

      var particles = [p1, p2];
      console.log(particles[0].geometry.position);
      console.log(particles[1].geometry.position);
      function init() {
        for (var i = 0; i < particles.length; i++ ){
          var geo = particles[i].geometry;
          scene.add(geo);

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
        var E_vec = new THREE.Vector3(0, 0 , 0);
        for (var i = 0; i < particles.length; i++) {
          if (particles[i] != target_particle) {
            var tp = new THREE.Vector3(); 
            tp.copy(target_particle.geometry.position);
            var r_harpoon = tp.sub(particles[i].geometry.position);
            var r_hat = r_harpoon.normalize();
            var e = r_hat.multiplyScalar(980*particles[i].charge)
            var E = e.divideScalar(r_harpoon.length()).divideScalar(r_harpoon.length());

            E_vec.add(E);
          }
        }

        return E_vec;
      }

      function updateForce() {
        for (var n = 0; n < particles.length; n++) {
          var E_vec = applyElectricField(particles[n], particles);
          var F_e = E_vec.multiplyScalar(particles[n].charge);
          var accel = F_e.divideScalar(particles[n].mass);
          console.log(accel);
          particles[n].velocity.add(accel);
          particles[n].geometry.position.add(particles[n].velocity);
        }
      }

      function render() {
        requestAnimationFrame( render );
        updateForce();
        renderer.render( scene, camera ); 
      }
      init();
      render();