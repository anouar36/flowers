
onload = () => {
    const c = setTimeout(() => {
      document.body.classList.remove("not-loaded");
      clearTimeout(c);
    }, 1000);
    
    // Add floating particles effect
    createFloatingParticles();
  };
  
  function createFloatingParticles() {
    const container = document.body;
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.innerHTML = '✨';
        particle.style.cssText = `
          position: fixed;
          pointer-events: none;
          z-index: 50;
          font-size: ${Math.random() * 10 + 10}px;
          color: hsl(${Math.random() * 360}, 80%, 60%);
          left: ${Math.random() * 100}vw;
          top: 100vh;
          text-shadow: 0 0 10px currentColor;
          animation: float-up ${Math.random() * 10 + 15}s linear infinite;
        `;
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, (Math.random() * 10 + 15) * 1000);
      }, i * 2000);
    }
    
    // Repeat the effect
    setTimeout(createFloatingParticles, 30000);
  }