// sidebars------------------------------------------------------
function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
}

// nospiezot checkbox parādas/aizveras select menu-----------------------
  document.getElementById("checkbox").addEventListener('click', function () {
  if (document.getElementById("checkbox").checked === true) {
    document.getElementById("selectmenu").style="display:block;"
  } else {
    document.getElementById("selectmenu").style="display:none;";
  }
})


// select menu ieks sidebar-----------------------------------------------
var x, i, j, l, ll, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /*for each element, create a new DIV that will act as the selected item:*/
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /*for each element, create a new DIV that will contain the option list:*/
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /*for each option in the original select element,
    create a new DIV that will act as an option item:*/
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /*when an item is clicked, update the original select box,
        and the selected item:*/
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
      /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
}
function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);


// tabula--------------------------------------------------
window.addEventListener('load', function() {
  document.getElementById('save-btn').addEventListener('click', function() {
    const form = document.getElementById('user-form').elements;

    if(isFormValid(form)) {
      let userList = localStorage.userList;

      if (userList) {
        userList = JSON.parse(userList);
      } else {
        userList = [];
      }

      const user = {
        username: form.namedItem('username').value,
        email: form.namedItem('email').value,
        checkbox: form.namedItem('checkbox').checked,
        brand: form.namedItem('brand').value,
      };

      const userId = form.namedItem('user-id').value;
      if (userId) {
        userList[userId] = JSON.stringify(user);
      } else {
        userList.push(JSON.stringify(user));
      }

      localStorage.userList = JSON.stringify(userList);

      console.log('can be saved')
      
      renderTable();
    } else {
      console.log('form not valid')
    }
  });


  function isFormValid(form) {
    let isFormValid = true;

    const errorMsgBlocks = document.getElementsByClassName('error-msg');
    Object.values(errorMsgBlocks).forEach(function(block) {
      block.innerHTML = '';
    })

    const username = form.namedItem('username').value;
    console.log(username);

    if (username.length < 6) {
      const errorMsg = document.getElementsByClassName('error-msg username')[0];
      errorMsg.innerHTML = "Min 6 characters for username"
      isFormValid = false;
    }

    const email = form.namedItem('email').value;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test(email)){
      isFormValid = false;
      const errorMsg = document.getElementsByClassName('error-msg email')[0];
      errorMsg.innerHTML = "email not valid" 
      isFormValid = false;
    }


    // const checkbox = form.namedItem('checkbox').checked;
    // if (checkbox.checked === true) {
    //   return checkbox;
    // } else {
    //   return document.getElementsByName('brand');
    // }
    // console.log(checkbox);
   
    return isFormValid;
  }
  // console.log('loaded 1')
    
  function renderTable() {
    const table = document.getElementById('users-table');
    const tBody = table.getElementsByTagName('tbody')[0];
    tBody.innerHTML = '';
    const userList = localStorage.userList ? JSON.parse(localStorage.userList) : [];

    userList.forEach(function(user, index) {
      user = JSON.parse(user)
      tBody.innerHTML += `
        <tr>
          <td>`+user.username+`</td>
          <td>`+user.email+`</td>
          <td>`+user.checkbox+`</td>
          <td>`+user.brand+`</td>
          <td>
            <button class="delete-btn" user-id=`+index+`>Delete</button>
          </td>
        </tr>
      `;
    })
 
    const deleteBtns = document.getElementsByClassName("delete-btn")

    Object.values(deleteBtns).forEach(function(btn) {
      btn.addEventListener('click', function(click) {
        const userId = click.target.getAttribute('user-id');
        const userList = JSON.parse(localStorage.userList);
        userList.splice(userId,1);

        localStorage.userList = JSON.stringify(userList);
        //sis komentetais bloks(zemākās 4 rindinas) ir resursu efektīvāk jo netiek parladeta lapa ik reizi, vienigi css stils kautkā neiet kopā(Ja vēlies izmantot tad nonem zemāko rindinu kur ir renderTable();)
        const table = document.getElementById('users-table');
        const tBody = table.getElementsByTagName('tbody')[0];
        const tRowToDelete = tBody.getElementsByTagName('tr')[userId];

        tRowToDelete.innerHTML = '';

        // renderTable();
      })
    }
    )
  }
  renderTable();
})




