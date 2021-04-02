//stable elements on the dom selected

const form = document.querySelector('#state-form')

const statesDiv = document.querySelector('#state-list')

const passport = document.querySelector('#passport')

const addStateForm = document.querySelector('#form')

const userForm = document.querySelector('#user-login')

//global objects to check the values of states and hold the selected state when passport is loaded

const allStates = ["Florida", "Nevada", "Wyoming", "Idaho", "Montana", "Utah", "Maine", "New Hampshire", "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Hawaii", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Nebraska", "New Jersey", "New Mexico", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Vermont", "Virginia", "West Virginia", "Wisconsin", "New York", "Georgia", "Washington"]

const statesInDb = []

let selectedStates = {}

let statesInPassport = []



//Initial Fetch, populates left side state board from our database
fetch('https://thawing-mesa-11991.herokuapp.com/states')
.then(res => res.json())
.then(jsonArray => {
    jsonArray.forEach(stateBarCreateElements)
})

form.addEventListener("submit", function (evt) {
    evt.preventDefault();
    //console.log(evt)
    if(statesInDb.find(state => evt.target.newState.value.toLowerCase() === state.toLowerCase())) {
        return alert("You've already been there jabroni, add a visit!")
    }
    
    if(allStates.find(state => evt.target.newState.value.toLowerCase() === state.toLowerCase())){
        let newState = ""
        if(evt.target.newState.value.toLowerCase() === "georgia") {
            newState = "Georgia_(U.S._state)"
        } else if (evt.target.newState.value.toLowerCase() === "new york"){
            newState = "New_York_(state)"
        } else if (evt.target.newState.value.toLowerCase() === "washington"){
            newState = "Washington_(state)"
        } else {
            newState = evt.target.newState.value
        }
        //console.log(newState)
        fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${newState}`)
            .then(res => res.json())
            .then(stateInfo => {
                //console.log(stateInfo)
                fetch('https://thawing-mesa-11991.herokuapp.com/states', {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        accept: "application/json"
                    },
                    body: JSON.stringify({
                        name: `${stateInfo.title}`,
                        flag: `${stateInfo.thumbnail.source}`,
                        description: `${stateInfo.extract}`,
                        visits: 0,
                        
                    })
                })
                .then(res=>res.json())
                .then(jsonObj => {
    
                    stateBarCreateElements(jsonObj)
                })
            }) 
        } else {
            alert("That's not a state, ya donut!")
        }    
})

function stateBarCreateElements(jsonObj) {
    statesInDb.push(jsonObj.name.toLowerCase())
    console.log(jsonObj.name)
    let userStates = jsonObj

    const stateSpan = document.createElement('span');
        stateSpan.className = 'state-item'
    
    const stateP = document.createElement('p');
        stateP.className = 'stateP'
        stateP.innerText = jsonObj.name
    
    const stateImg = document.createElement('img')
        stateImg.className = 'stateImg'
        stateImg.src = jsonObj.flag

    const stateDescription = document.createElement('p')
        stateDescription.className= "class-description"
        stateDescription.innerText = jsonObj.description

    const stateVisitP = document.createElement('p')
        stateVisitP.innerText = `Visits: ${jsonObj.visits}`
    
    const stateVisitAddButton = document.createElement('button')
        stateVisitAddButton.innerText = 'Add Visit'
    
    const stateVisitDeleteButton = document.createElement('button')
        stateVisitDeleteButton.innerText = 'Delete Visit'

    const stateDeleteButton = document.createElement("button")
        stateDeleteButton.className = 'delete-button'
        stateDeleteButton.innerText = "Delete"
    
    stateSpan.append(stateP, stateImg, stateDescription, stateVisitP, stateVisitAddButton, stateVisitDeleteButton, stateDeleteButton)

    statesDiv.append(stateSpan)
    
    stateVisitAddButton.addEventListener('click', () => {
        fetch(`https://thawing-mesa-11991.herokuapp.com/states/${jsonObj.id}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                visits: userStates.visits + 1
            })
        })
        .then(res => res.json())
        .then(newObj => {
            userStates.visits = newObj.visits
            stateVisitP.innerText = `Visits: ${jsonObj.visits}`
        })
    })
    
    stateVisitDeleteButton.addEventListener('click', () => {
        if(jsonObj.visits > 0) {
            fetch(`https://thawing-mesa-11991.herokuapp.com/states/${jsonObj.id}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                    accept: "application/json"
                },
                body: JSON.stringify({
                    visits: jsonObj.visits - 1
                })
            })
            .then(res => res.json())
            .then(newObj => {
                jsonObj.visits = newObj.visits
                stateVisitP.innerText = `Visits: ${jsonObj.visits}`
            })
        }
    })
    //deletes card from passport
    stateDeleteButton.addEventListener("click", () => {
        fetch(`https://thawing-mesa-11991.herokuapp.com/states/${jsonObj.id}`, {
            method: "DELETE", 
            headers: {
                "Content-Type": "application/json"
            }  
        })
        .then(res => {
            stateSpan.remove()s
            index = statesInDb.indexOf(jsonObj.name.toLowerCase())
            statesInDb.splice(index, 1)
        })
    })
}
