// * ~~~~~~~~~~~~~~~~~~~ Api ~~~~~~~~~~~~~~~~~~~
const Api = (() => {
  // logic to fetch the profiles from API
  const getProfiles = () => {
    var sendback = [];
    for (let i = 0; i < 20; i++) {
      fetch("https://randomuser.me/api")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          sendback.push(data);
        });
    }
    return sendback;
  };
  return {
    getProfiles,
  };
})();
// * ~~~~~~~~~~~~~~~~~~~ View ~~~~~~~~~~~~~~~~~~~

// set up the dom elements
const View = (() => {
  const domstr = {
    profile: "#profile",
  };

  // set the InnerHTML based on the template
  const render = (ele, tmp) => {
    ele.innerHTML = tmp;
  };

  // create the template ; for each todo, structure the HTML
  const createTmp = (arr) => {
    let tmp = "";
    arr.forEach((profile) => {
      tmp += `
        <div class="wholebox">
             <div class="flex">
                <div>
                    <img class="picture" src="${profile.results[0].picture.large}" alt="Girl in a jacket" width="100" height="100">
                </div>
                <div class="textbox">
                    <p class = "text"> name: ${profile.results[0].name.title} ${profile.results[0].name.first} ${profile.results[0].name.last} </p>
                    <p>email: ${profile.results[0].email} </p>
                    <p>phone: ${profile.results[0].phone} </p>
                    <button id="${profile.info.seed}" class="button"> Show Dob </button>
                    <button class="DOB" id="${profile.info.seed}DOB">date of birth: ${profile.results[0].dob.date} </button>
                </div>
            </div>
       </div>
        `;
    });
    return tmp;
  };

  return {
    render,
    createTmp,
    domstr,
  };
})();

// * ~~~~~~~~~~~~~~~~~~~ Model ~~~~~~~~~~~~~~~~~~~

const Model = ((api, view) => {
  const { getProfiles } = api;

  class State {
    #Userlist = [];

    get Userlist() {
      return this.#Userlist;
    }

    set Userlist(NewUserlist) {
      this.#Userlist = NewUserlist;
      const profiless = document.querySelector(view.domstr.profile);
      const tmp = view.createTmp(this.#Userlist);
      view.render(profiless, tmp);
    }
  }
  return {
    getProfiles,
    State,
  };
})(Api, View);

// * ~~~~~~~~~~~~~~~~~~~ Controller ~~~~~~~~~~~~~~~~~~~
const Controller = ((model, view) => {
  // create instance of state
  const state = new model.State();

  const showDOB = () => {
    const todocontainer = document.querySelector(view.domstr.profile);
    // when edit is clicked, new input element is created and the text is replaced with this input
    todocontainer.addEventListener("click", (event) => {
      if (event.target.className === "button") {
        const changeId = event.target.id;
        const Dateofbirth = document.getElementById(`${changeId}DOB`);
        if (Dateofbirth.className === "DOB") {
          Dateofbirth.className = "DOB_show";
          event.target.className = "button_hide";
        }
      }
    });
  };

  const showbutton = () => {
    const todocontainer = document.querySelector(view.domstr.profile);
    // when edit is clicked, new input element is created and the text is replaced with this input
    todocontainer.addEventListener("click", (event) => {
      if (event.target.className === "DOB_show") {
        let changeId = event.target.id;
        changeId = changeId.toString().slice(0, 16);
        const Dateofbirth = document.getElementById(`${changeId}`);
        if (Dateofbirth.className === "button_hide") {
          Dateofbirth.className = "button";
          event.target.className = "DOB";
        }
      }
    });
  };

  const reloadscreen = () => {
    const reloadbutton = document.getElementById("reload");
    reloadbutton.addEventListener("click", (event) => {
      location.reload();
    });
  };

  const loadingswitch = () => {
    const loadingtext = document.getElementById("loading");
    setTimeout(function () {
      loadingtext.className = "hideloading";
    }, 3000);
  };

  // timeout set to 3 seconds to make sure all 20 profiles load in
  const init = () => {
    const data = model.getProfiles();
    setTimeout(function () {
      console.log(data);
      state.Userlist = data;
    }, 3000);
  };

  const bootstrap = () => {
    init();
    showDOB();
    showbutton();
    reloadscreen();
    loadingswitch();
  };

  return { bootstrap };
})(Model, View);

Controller.bootstrap();
