// Toggle solution visibility
function toggleSolution(button) {
    const solution = button.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (solution.classList.contains('hidden')) {
        solution.classList.remove('hidden');
        button.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Solution';
    } else {
        solution.classList.add('hidden');
        button.innerHTML = '<i class="fas fa-eye"></i> Show Solution';
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Load content asynchronously
async function loadContent(filename, targetId) {
  const targetSection = document.getElementById(targetId);
  const outputPanel = targetSection.querySelector('.output-panel');
  if (!outputPanel) {
    console.error('No output-panel found in', targetId);
    return;
  }
  outputPanel.innerHTML = '<p>Loading content...</p>';
  try {
    const response = await fetch(filename);
    if (!response.ok) throw new Error('Failed to load ' + filename);
    const html = await response.text();
    // Extract questions-container or whole body content
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const questionsContainer = doc.querySelector('.questions-container');
    if (questionsContainer) {
      outputPanel.innerHTML = questionsContainer.outerHTML;
      // Re-attach toggleSolution to loaded buttons
      outputPanel.querySelectorAll('.toggle-solution').forEach(btn => {
        btn.onclick = () => toggleSolution(btn);
      });
    } else {
      outputPanel.innerHTML = '<p>No content found.</p>';
    }
    // Re-run observer on new content
    reObserve();
  } catch (error) {
    outputPanel.innerHTML = '<p>Error loading content: ' + error.message + '</p>';
  }
}

// Re-observe for animations after loading
function reObserve() {
  const newCards = document.querySelectorAll('.question-card:not([data-observed])');
  newCards.forEach(card => {
    card.setAttribute('data-observed', 'true');
    observer.observe(card);
  });
}

// Toggle solution visibility
function toggleSolution(button) {
  const solution = button.nextElementSibling;
  const icon = button.children[0];
  if (solution.classList.contains('hidden')) {
    solution.classList.remove('hidden');
    button.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Solution';
  } else {
    solution.classList.add('hidden');
    button.innerHTML = '<i class="fas fa-eye"></i> Show Solution';
  }
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Intersection observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// DOM ready
document.addEventListener('DOMContentLoaded', function() {
  // Observe initial cards
  document.querySelectorAll('.category-card, .question-card').forEach(card => {
    observer.observe(card);
  });
  
  // Sidebar functionality
  const sidebarBtns = document.querySelectorAll('.sidebar-btn');
  const contentSections = document.querySelectorAll('.content-section');
  
  sidebarBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const target = this.dataset.target;
      
      // Update active states
      sidebarBtns.forEach(b => b.classList.remove('active'));
      contentSections.forEach(section => section.classList.remove('active'));
      this.classList.add('active');
      document.getElementById(target).classList.add('active');
      
      // Load content if data-file attribute present
      const filename = this.dataset.file;
      if (filename && target) {
        loadContent(filename, target);
      }
    });
  });
  
  // Attach toggle to existing buttons
  document.querySelectorAll('.toggle-solution').forEach(btn => {
    btn.onclick = () => toggleSolution(btn);
  });
});
