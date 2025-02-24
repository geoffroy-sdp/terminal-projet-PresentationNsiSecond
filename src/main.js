import Typed from 'typed.js';

// Configuration de l'animation de frappe initiale
const typedConfig = {
  strings: [
    'Initialisation de la spécialité NSI... [OK]',
    'Préparation des modules : Programmation, Algorithmes, Réseaux... [OK]',
    'Système prêt.',
    'Appuyez sur [Entrée] pour démarrer la visite guidée.'
  ],
  typeSpeed: 40,
  backSpeed: 0,
  loop: false,
  showCursor: true,
  cursorChar: '_',
  onComplete: (self) => {
    document.querySelector('.terminal-input').style.display = 'block';
    initializeGuidedTour();
  }
};

// Configuration de la visite guidée
const tourSteps = [
  {
    section: '#about',
    command: 'cd /about && cat description.txt',
    content: 'Bienvenue dans la section "Qu\'est-ce que NSI?". Découvrez les fondamentaux de cette spécialité passionnante.'
  },
  {
    section: '#programming',
    command: 'cd /programming && ls -la',
    content: 'Explorez la programmation et les technologies clés en NSI.'
  },
  {
    section: '#methods',
    command: 'cd /methods && cat workflow.txt',
    content: 'Découvrez nos méthodes de travail et l\'apprentissage en NSI.'
  },
  {
    section: '#projects',
    command: 'cd /projects && ./show_examples.sh',
    content: 'Voici les types de projets que vous réaliserez en NSI.'
  },
  {
    section: '#careers',
    command: 'cd /careers && ./show_opportunities.sh',
    content: 'Explorons les nombreuses opportunités qui s\'offrent à vous après NSI.'
  },
  {
    section: '#faq',
    command: 'cd /faq && grep -r "questions" .',
    content: 'Des questions ? Consultez notre FAQ pour tout savoir sur NSI.'
  },
  {
    section: '#contact',
    command: 'cd /contact && ./connect.sh',
    content: 'Vous souhaitez nous contacter ? C\'est par ici !'
  }
];

let currentStep = 0;
let tourActive = false;
let currentTyped = null;

function initializeGuidedTour() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !tourActive) {
      startGuidedTour();
    } else if (e.key === 'Enter' && tourActive) {
      nextStep();
    }
  });
}

function startGuidedTour() {
  tourActive = true;
  currentStep = 0;
  document.querySelector('.terminal-input').style.display = 'none';
  
  // Réinitialiser le terminal pour la visite
  const terminalContent = document.querySelector('.terminal-content');
  terminalContent.innerHTML = '<div id="tour-output"></div>';
  
  showStep();
}

function showStep() {
  if (currentStep >= tourSteps.length) {
    endTour();
    return;
  }

  const step = tourSteps[currentStep];
  const element = document.querySelector(step.section);
  
  // Scroll vers la section avec animation
  element.scrollIntoView({ behavior: 'smooth' });

  // Afficher la commande et le contenu avec animation
  if (currentTyped) {
    currentTyped.destroy();
  }

  currentTyped = new Typed('#tour-output', {
    strings: [
      `<span class="command">> ${step.command}</span><br>` +
      `<span class="output">${step.content}</span><br>` +
      '<span class="prompt">[Appuyez sur Entrée pour continuer]</span>'
    ],
    typeSpeed: 40,
    showCursor: true,
    cursorChar: '_',
    contentType: 'html'
  });

  // Ajouter un effet de focus sur la section courante
  document.querySelectorAll('.terminal-section').forEach(section => {
    section.classList.remove('active-section');
  });
  element.classList.add('active-section');
}

function nextStep() {
  currentStep++;
  showStep();
}

function endTour() {
  tourActive = false;
  if (currentTyped) {
    currentTyped.destroy();
  }
  
  // Réinitialiser l'affichage du terminal
  const terminalContent = document.querySelector('.terminal-content');
  terminalContent.innerHTML = `
    <div id="typed-output"></div>
    <div class="terminal-input">
      <span class="prompt">$</span>
      <span class="cursor"></span>
    </div>
  `;

  // Réinitialiser les effets de focus
  document.querySelectorAll('.terminal-section').forEach(section => {
    section.classList.remove('active-section');
  });

  // Retour à l'accueil
  document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
  
  // Réinitialiser l'animation initiale
  new Typed('#typed-output', typedConfig);
}

// Matrix Rain Effect
function setupMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas size
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Characters to use
  const chars = '0123456789ABCDEF';
  const fontSize = 14;
  const columns = canvas.width / fontSize;
  const drops = [];

  // Initialize drops
  for (let i = 0; i < columns; i++) {
    drops[i] = 1;
  }

  function draw() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff00';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 33);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const typed = new Typed('#typed-output', typedConfig);
  setupMatrixRain();

  // Gestion de la navigation fluide avec animations
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        // Retirer la classe active de toutes les sections
        document.querySelectorAll('.terminal-section').forEach(section => {
          section.classList.remove('active-section');
        });
        
        // Ajouter la classe active à la section cible
        target.classList.add('active-section');
        
        // Animation de défilement fluide
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Animation du terminal au scroll
  const observerOptions = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.terminal-window').forEach(el => {
    observer.observe(el);
  });
});

// Effet de glitch aléatoire sur le titre
setInterval(() => {
  const glitchText = document.querySelector('.glitch');
  if (glitchText) {
    glitchText.style.animation = 'none';
    void glitchText.offsetWidth;
    glitchText.style.animation = null;
  }
}, 3000);