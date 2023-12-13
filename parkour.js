import * as THREE from 'three'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const objects = []; //list ~ array
let raycaster; //raygun

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now(); //current time
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let camera, scene, controls, renderer;

init();
animate();
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 10;

    controls = new PointerLockControls(camera, document.body);

    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');

    instructions.addEventListener('click', function () {
        controls.lock();
    });
    controls.addEventListener('lock', function () {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    });
    controls.addEventListener('unlock', function () {
        blocker.style.display = 'block';
        instructions.style.display = '';
    });
    scene.add(controls.getObject());

    const onKeyDown = function (event) {
        switch (event.code) {
            case 'KeyW':
                moveForward = true;
                break
            case 'KeyA':
                moveLeft = true;
                break;
            case 'KeyD':
                moveRight = true;
                break;

            case 'KeyS':
                moveBackward = true;
                break;
            case 'Space':
                if (canJump === true) velocity.y += 350;
                canJump = false;
                break;
        }
    }

    const onkeyup = function (event) {
        switch (event.code) {
            case 'KeyW':
                moveForward = false;
                break;

            case 'KeyS':
                moveBackward = false;
                break;

            case 'KeyA':
                moveLeft = false;
                break;

            case 'KeyD':
                moveRight = false;
                break;
        }
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onkeyup);

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

    const planeGeometry = new THREE.PlaneGeometry(10, 100, 64, 64);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xff89ff });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotateX(-1.57)
    scene.add(plane);
    objects.push(plane)

    const boxGeo = new THREE.BoxGeometry(50,50,50);
    const boxMat = new THREE.MeshLambertMaterial({ color: 0xff4ff });
    const box1 = new THREE.Mesh(boxGeo,boxMat);
    scene.add(box1);
    box1.position.x = -50;
    objects.push(box1);

    const box2Geo = new THREE.BoxGeometry(50,50,50);
    const box2Mat = new THREE.MeshLambertMaterial({ color: 0xff500ff });
    const box2 = new THREE.Mesh(boxGeo,boxMat);
    scene.add(box2);
    box1.position.x = -60;
    box1.position.z = -20;
    objects.push(box2);

    const sphereGeo = new THREE.SphereGeometry(50,50,50);
    const sphereMat = new THREE.MeshLambertMaterial({ color: 0xff698ff });
    const sphere1 = new THREE.Mesh(sphereGeo,sphereMat);
    scene.add(sphere1);
    sphere1.position.x = -150;
    sphere1.position.y = -40;
    sphere1.position.z = 100;
    objects.push(sphere1);

    const sphere2Geo = new THREE.SphereGeometry(50,50,50);
    const sphere2Mat = new THREE.MeshLambertMaterial({ color: 0xff698ff });
    const sphere2 = new THREE.Mesh(sphere2Geo,sphere2Mat);
    scene.add(sphere2);
    sphere2.position.x = -300;
    sphere2.position.y = -40;
    sphere2.position.z = 100;
    objects.push(sphere2)

    const sphere3Geo = new THREE.SphereGeometry(50,50,50);
    const sphere3Mat = new THREE.MeshLambertMaterial({ color: 0xff698ff });
    const sphere3 = new THREE.Mesh(sphere3Geo,sphere3Mat);
    scene.add(sphere3);
    sphere3.position.x = -450;
    sphere3.position.y = -40;
    sphere3.position.z = 100;
    objects.push(sphere3);

    const sphere4Geo = new THREE.SphereGeometry(50,50,50);
    const sphere4Mat = new THREE.MeshLambertMaterial({ color: 0xff698ff });
    const sphere4 = new THREE.Mesh(sphere4Geo,sphere4Mat);
    scene.add(sphere4);
    sphere4.position.x = -600;
    sphere4.position.y = -40;
    sphere4.position.z = 100;
    objects.push(sphere4);

    

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize)
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();


    renderer.setSize(window.innerWidth, window.innerHeight);

}



function animate() {
    requestAnimationFrame(animate);
    const time = performance.now();
    if (controls.isLocked === true) {
        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 10;

        const intersections = raycaster.intersectObjects(objects, false);
        const onObject = intersections.length > 0;
        const delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta;


        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        if (onObject === true) {
            velocity.y = Math.max(0, velocity.y);
            canJump = true;
        }
        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
        controls.getObject().position.y += (velocity.y * delta);

        if (controls.getObject().position.y < 10) {
            velocity.y = 0;
            controls.getObject().position.y = 10;
            canJump = true;
        }
    }
    prevTime = time;
    renderer.render(scene, camera);
}

