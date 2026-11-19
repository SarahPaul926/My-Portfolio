import * as THREE from 'https://unpkg.com/three@0.180.0/build/three.module.js';

import { GLTFLoader }
    from 'https://unpkg.com/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

// LOAD LEAF MODEL
const leafCanvas = document.getElementById("leaf-canvas");
const leafScene = new THREE.Scene();

const leafCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
leafCamera.position.z = 3;

const leafRenderer = new THREE.WebGLRenderer({
    canvas: leafCanvas,
    alpha: true,
    antialias: true
});
leafRenderer.setSize(window.innerWidth, window.innerHeight);
leafRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Background Lighting Context
const leafAmbient = new THREE.AmbientLight(0xffffff, 2.0);
leafScene.add(leafAmbient);
const leafDirectional = new THREE.DirectionalLight(0xffffff, 2.5);
leafDirectional.position.set(2, 3, 5);
leafScene.add(leafDirectional);


let leaf;

loader.load(
    "Models/autumn-leaf.glb",
    function (gltf) {
        console.log("LEAVES LOADED!");
        leaf = gltf.scene;
        leaf.traverse((child) => {
            if (child.isMesh) {
                if (child.material) {
                    child.material.transparent = true;
                    child.material.alphaTest = 0.5;
                }

                child.castShadow=true;
                child.receiveShadow=true;
            }
        });
        leaf.scale.set(5, 5, 5);
        // STARTING POSITION
        const box=new THREE.Box3().setFromObject(leaf);
        const center=box.getCenter(new THREE.Vector3());
        leaf.position.sub(center);
        leaf.position.set(2,0,0);
        // === STEP 1: INITIAL ORIENTATION LOCK ===
        leaf.rotation.x = 1;
        leaf.rotation.y = 1;
        leaf.rotation.z = 0;
        leafScene.add(leaf);
    },
    undefined,
    function (error) {
        console.error("Error loading leaves:", error);
    }
);

// SCROLL
let scrollProgress = 0;
window.addEventListener("scroll", () => {
    const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = window.scrollY / maxScroll;

});


// ANIMATION
function animate() {

    requestAnimationFrame(animate);
    
    if (leaf) {
    
    const targetY = -scrollProgress * 2;
    leaf.position.y += (targetY - leaf.position.y) * 0.04;
    // -------------------------
    // 2. DRIFT LEFT AND RIGHT
    // -------------------------
    const originalWaveTarget =  0.2 - Math.sin(scrollProgress * Math.PI * 2) * 1.5;;
    const projectsCenterTarget = 0.0; 
    let targetX;
    // If the user hasn't reached the Projects section yet (above 70% scroll)
    if (scrollProgress < 0.5) {
        targetX = originalWaveTarget;
        leaf.position.x += (targetX - leaf.position.x) * 0.02;
    } else {
        const blendFactor = Math.min((scrollProgress - 0.5) / 0.15, 1.0); 
        targetX = originalWaveTarget + (projectsCenterTarget - originalWaveTarget) * blendFactor;
    }
    leaf.position.x += (targetX - leaf.position.x) * 0.04;
    // -------------------------
    // 3. GENTLE ROTATION
    // -------------------------

    const targetRotation =
        Math.sin(scrollProgress * Math.PI * 3.5) * 0.45;

    leaf.rotation.z +=
        (targetRotation - leaf.rotation.z) * 0.04;


    // -------------------------
    // 4. SMALL NATURAL TILT
    // -------------------------

    const targetTiltX =
        Math.sin(scrollProgress * Math.PI * 4) * 0.9;

    const targetTiltY =
        Math.cos(scrollProgress * Math.PI * 2.5) * 0.12;

    leaf.rotation.x +=
        (targetTiltX - leaf.rotation.x) * 0.04;

    leaf.rotation.y +=
        (targetTiltY - leaf.rotation.y) * 0.04;
}

    leafRenderer.render(leafScene, leafCamera);
}

animate();


// RESIZE

window.addEventListener("resize", () => {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

});

// NAVBAR
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const navAnchors = navLinks.querySelectorAll("a");

function closeMenu() {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen);
});

navAnchors.forEach(a => a.addEventListener("click", closeMenu));

window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
});

// Highlight the link for the section currently in view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navAnchors.forEach(a =>
                a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
            );
        }
    });
}, { rootMargin: "-50% 0px -50% 0px" });

document.querySelectorAll("section[id]").forEach(s => observer.observe(s));
