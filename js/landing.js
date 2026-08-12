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

 const trustItems=document.querySelectorAll(".trust-item");

const observer=new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},{
threshold:.2
});

trustItems.forEach(item=>observer.observe(item));

document.querySelectorAll(".service-card").forEach(card=>{

observer.observe(card);

});
const circles=document.querySelectorAll(".circle");
const lines=document.querySelectorAll(".line");

const workObserver=new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},{threshold:.5});

circles.forEach(c=>workObserver.observe(c));
lines.forEach(l=>workObserver.observe(l));
document.querySelectorAll(".professional-card").forEach(card=>{
    observer.observe(card);
});
document.querySelectorAll(".project-card").forEach(card=>{
    observer.observe(card);
});
document.querySelectorAll(".feature-box").forEach(card=>{

observer.observe(card);

});
document.querySelectorAll(".dashboard-left,.dashboard-right")
.forEach(el=>observer.observe(el));
observer.observe(document.querySelector(".final-cta"));

const topBtn = document.getElementById("backToTop");

topBtn?.addEventListener("click", () => {

window.scrollTo({

top:0,

behavior:"smooth"

});

});
