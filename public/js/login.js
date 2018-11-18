document.querySelector("#registerBtn").addEventListener("click", ()=>{
	$("#loginForm").toggle(100);
	$("#registerForm").toggle(200);
});

document.querySelector("#loginBack").addEventListener("click", ()=>{
	$("#loginForm").toggle(200);
	$("#registerForm").toggle(100);
})