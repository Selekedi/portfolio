const formHeader = document.querySelector('form > h2')
const email = document.getElementById("email")
const password = document.getElementById("password")
const nameGroup = document.querySelector('form .form-group.name')
const confirmPasswordFormGroup = document.querySelector("form .form-group.confirm-password")
const authBtn = document.querySelector("form > button#auth-btn")
const authChange = document.querySelector("p.auth-change")

let signUp = initializeSessionStorage("sign-up",false)
updateSignInForm()
console.log(signUp);


authBtn.addEventListener("click", async e => {
    e.preventDefault()
    const emailValue = email.value
    const passwordValue = password.value
    if(!signUp){
        const signnedIn = await signInUser(emailValue,passwordValue)
        if(!signnedIn){
            return
        }
        window.location.href = "/"
        return
    }else {
        const name = document.getElementById("name").value
        const confrimPassword = document.getElementById("confirm-password").value
        const signnedUp = await signUpUser(emailValue,passwordValue,name,confrimPassword)
        if (!signnedUp){
            return
        }
        window.location.href = "/"
        return
    }
})

function changeAuth(){
    signUp = updateSesssionStorage("sign-up",!signUp)
    updateSignInForm()
}

function updateSignInForm(){
    if(!signUp){
        formHeader.textContent = "Sign In"
        nameGroup.innerHTML = ""
        confirmPasswordFormGroup.innerHTML = ""
        authBtn.textContent = "Sign In"
        authChange.innerHTML = `dont have an account? <a href="#" onclick="changeAuth()">Register Here</a>`
    }
    else {
        formHeader.textContent = "Sign Up"
        nameGroup.innerHTML = `
            <label for="name">Name</label>
            <input type="text" id="name" placeholder = "Enter Your Name">
        `
        confirmPasswordFormGroup.innerHTML = `
            <label for="confirmm-password">Confirmm Password</label>
            <input type="password" id="confirm-password" placeholder = "Confirm Password">
        `
        authBtn.textContent = "Sign Up"
        authChange.innerHTML = `already have an account? <a href="#" onclick="changeAuth()">Sign In Here</a>`
    }
}

async function signInUser(email,password){
    try {
        const response =  await fetch("sign_in",{
            method:"post",
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({email:email,password:password})
        })

        if(!response.ok){
            alert("network issues, please try again later")
            return false
        }

        const responseData = await response.json()
        if(!responseData.signnedIn){
            alert("error in siginin in, check if the credentials are correct")
            return false
        } else {
            return true
        }

    } catch (error) {
        alert("error, couldnt sign you in, try again")
        return false
    }
}

async function signUpUser(email,password,name,confrimPassword){
    email = String(email).trim()
    if(!validateEmail(email)){
        alert("invalid Email, check email and enter correct one")
        return false
    }
    name = String(name).trim()
    if(name.length < 1){
        alert("name not entered, Enter Name Please")
        return false
    }
    password = String(password).trim()
    confrimPassword = String(confrimPassword).trim()
    if(password !== confrimPassword){
        alert("passwords dont match, check them and rectify them")
        return false
    }

    try {
        const response = await fetch("sign_up",{
            method:"post",
            headers:{
                'Content-Type':"application/json"
            },
            body: JSON.stringify({email,password,name,confrimPassword})
        })
        if (!response.ok){
            alert("network issues, try again later")
            return false
        }

        const responseData = await response.json()
        if(!responseData.signnedUp){
            alert("couldnt get you signed up, could be because email is not availible")
            return false
        }
        return true

    } catch (error) {
        console.error(error)
        alert("couldnt sign you uo, try again")
        return false
    }
}

function validateEmail(email) {
    // Regular expression to validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function initializeSessionStorage(key,value){
    console.log(JSON.parse(sessionStorage.getItem(key)));
    
    if(sessionStorage.getItem(key) == null){
        sessionStorage.setItem(key,JSON.stringify(value))
    }
    return JSON.parse(sessionStorage.getItem(key))
}

function updateSesssionStorage(key,value){
    sessionStorage.setItem(key,JSON.stringify(value))
    return JSON.parse(sessionStorage.getItem(key))
}
