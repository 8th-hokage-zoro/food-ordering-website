
document.querySelector(".login-button").addEventListener("click",function(){
  document.querySelector(".popup-content").classList.add("active");
});

document.querySelector(".popup-content .close-button").addEventListener("click",function(){
  document.querySelector(".popup-content").classList.remove("active");
});



