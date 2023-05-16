const backTop = document.querySelector('.back-top');
const langMenu = document.querySelector('.lang-menu');

window.addEventListener("scroll", function() {
    if (document.body.scrollTop > (document.body.scrollHeight * 0.4) || document.documentElement.scrollTop > (document.documentElement.scrollHeight * 0.4)) {
        backTop.classList.remove('slide-out');
        backTop.classList.add('slide-in');
        backTop.style.display = "block";
    } else {
        backTop.classList.remove('slide-in');
        backTop.classList.add('slide-out');
    }
});

backTop.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

const github = document.querySelector('#github');

github.addEventListener("click", function() {
    window.open('https://github.com/Henry8K', '_blank');
});