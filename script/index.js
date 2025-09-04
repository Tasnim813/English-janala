const createElements=(arr)=>{
    const htmlElements=arr.map((el)=>` <span class="btn">${el}</span>`);
    return htmlElements.join("");
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}


const manageSpinner =(status)=>{
    if(status==true){
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    }
    else{
        document.getElementById("word-container").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");

    }

}

const loadLesson=()=>{
    fetch("https://openapi.programming-hero.com/api/levels/all")
    .then(res=>res.json())
    .then((json)=>displayLesson(json.data))
}

const removeActive=()=>{
    const lessonButton=document.querySelectorAll('.lesson-btn')
    lessonButton.forEach(btn=>btn.classList.remove("active"));
}
const loadLevelWord=(id)=>{
    manageSpinner(true);
    const url=`https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then(res=>res.json())
    .then((data)=>{
        removeActive()
        const clickBtn=document.getElementById(`lesson-btn-${id}`)
        clickBtn.classList.add("active")
        displaylevelWord(data.data)
    })

}

const loadWordDetail=async(id)=>{
    const url=`https://openapi.programming-hero.com/api/word/${id}`;
    
    const res=await fetch(url)
    const details=await res.json()
    displayWordDetails(details.data)
}
// {
//     "word": "Eat",
//     "meaning": "খাওয়া",
//     "pronunciation": "ইট",
//     "level": 1,
//     "sentence": "She likes to eat mangoes.",
//     "points": 1,
//     "partsOfSpeech": "verb",
//     "synonyms": [
//         "consume",
//         "devour",
//         "bite"
//     ],
//     "id": 75
// }
const displayWordDetails=(word)=>{
    console.log(word)
    const detailBox=document.getElementById("details-container")
    detailBox.innerHTML=`
     <div class="">
        <h2 class="text-2xl font-bold">${word.word} (  <i class="fa-solid fa-microphone-lines"></i>   :${word.pronunciation})</h2>

    </div>
    <div class="">
        <h2 class=" font-bold">Meaning</h2>
        <p>${word.meaning}</p>

    </div>
    <div class="">
        <h2 class=" font-bold">Example</h2>
        <p>${word.sentence}</p>

    </div>
    <div class="">
        <h2 class=" font-bold">সমার্থক শব্দ গুলো</h2>
        <div>${createElements(word.synonyms)}</div>

    </div>

    
    `;
    document.getElementById("word_modal").showModal();

}
const displaylevelWord=(words)=>{
    const wordContainer=document.getElementById("word-container");
    wordContainer.innerHTML='';
    if(words.length==0){
        wordContainer.innerHTML=`
         <div class="text-center  col-span-full rounded-xl py-10 space-y-6 font-bangla">
         <img class="mx-auto" src="./assets/alert-error.png" alt="">
            <p class="text-xl font-medium text-gray-400 ">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
        </div>
        
        `;
        manageSpinner(false);
        return;
        
    }
// {
// "id": 4,
// "level": 5,
// "word": "Diligent",
// "meaning": "পরিশ্রমী",
// "pronunciation": "ডিলিজেন্ট"
// },

    words.forEach(word=>{
        const cart=document.createElement('div');
        cart.innerHTML=`
        <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
            <h2 class="font-bold text-2xl">${word.word ?  word.word:"sob pawa jay ni"}</h2>
            <p class="font-semibold">Meaning /Pronounciation</p>
            <div class="text-2xl font-medium font-bangla">"${word.meaning ? word.meaning:"orto pawa jay ni"} / ${word.pronunciation ? word.pronunciation:"pronounciation pawa jay ni"}"</div>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>

            </div>

        </div>
        
        `
        wordContainer.append(cart)
    })
    manageSpinner(false)

}
const displayLesson=(lessons)=>{
    // 1.get the container & empty
    const levelContainer=document.getElementById('level-container')
    levelContainer.innerHTML='';
    // 2.get into every lesson
    for(let lesson of lessons){
        console.log(lesson)
        
        // 3.creat element
        const btnDiv=document.createElement("div");
        btnDiv.innerHTML=`
    <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord( ${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
        <i class="fa-solid fa-book-open"></i> lesson - ${lesson.level_no}
    </button>
`;
    // 4.append into container
    levelContainer.append(btnDiv)
    }
    

}
loadLesson()

document.getElementById("btn-search").addEventListener("click", ()=>{
    removeActive();
   const input= document.getElementById("input-search")
   const searchValue=input.value.trim().toLowerCase();
   console.log(searchValue)

   fetch("https://openapi.programming-hero.com/api/words/all")
   .then((res)=>res.json())
   .then((data)=>{
    const allWords=data.data;
    console.log(allWords)
    const filterWords=allWords.filter((word)=>
        word.word.toLowerCase().includes(searchValue)
    
    );
    displaylevelWord(filterWords)
   })
});