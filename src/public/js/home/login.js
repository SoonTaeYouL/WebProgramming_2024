'use strict';

const id = document.querySelector('#id'),
    password = document.querySelector('#password'),
    loginBtn = document.querySelector('Button');

loginBtn.addEventListener('click',login);

function login(){
    const req = {
        id: id.value,
        password: password.value
    };
    fetch('/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req)
    }).then((res)=>res.json())
    .then((res)=>{
        if(res.success){
            location.href = '/calendar';
        }else{
            alert(res.msg);
        }
    });
};