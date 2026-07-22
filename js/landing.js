    // Set current year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Centralized login navigation
    function goToLogin(){
      // Navigate to login page. Change path if your login route differs.
      window.location.href = '/login.html';
    }

    // Attach click handlers
    //document.getElementById('loginBtn').addEventListener('click', goToLogin);
    document.getElementById('heroLogin').addEventListener('click', goToLogin);
    document.getElementById('ctaLogin').addEventListener('click', goToLogin);
    document.getElementById('authBtn').addEventListener('click', goToLogin);

    // Small UX helpers
    document.getElementById('learnMore').addEventListener('click', function(){
      // Smooth scroll to features
      document.getElementById('features-heading').scrollIntoView({behavior:'smooth', block:'start'});
    });

    document.getElementById('exploreBtn').addEventListener('click', function(){
      // Quick jump to testimonials
      document.getElementById('testimonials-heading').scrollIntoView({behavior:'smooth', block:'center'});
    });

    // Keyboard accessibility: Enter on focused login buttons
    ['authBtn','heroLogin','ctaLogin'].forEach(id=>{
      const el = document.getElementById(id);
      el.addEventListener('keyup', function(e){
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          goToLogin();
        }
      });
    });

 