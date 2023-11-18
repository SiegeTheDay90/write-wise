class LoadingBar {
    constructor(form, url, options={}, action, completionCallback){
        this.bar = document.createElement('progress');
        this.status = document.createElement('p');
        this.container = form.parentElement;
        this.originalForm = form;
        form.remove();
        this.action = action;
        this.complete = 0;
        this.timeElapsed = 0;
        this.resourceId;

        this.completionCallback ||= completionCallback;

        this.container.append(this.bar);
        this.container.append(this.status);

        this.bar.innerText = 0;
        this.bar.max = 100;

        this.status.innerText = "In Progress..."
        // options["authenticity_token"] = "<%= form_authenticity_token %>";
        fetch(url, options).then((res) => this.loadingCallback(res)).catch(this.failureCallback);
    }

    incComplete(num){
        this.complete += num;
        this.bar.innerText = this.complete;
        this.bar.value = this.complete;
    }

    async loadingCallback(response){
        if(response.ok){
            const data = await response.json();
            if(data.ok){
                this.request_id = data.id;
                this.interval = setInterval(async () => {
                  const response = await fetch(`/check/${this.request_id}`)
                    const data = await response.json();
                    if(data.complete && data.ok){
                      this.messages = data.messages
                        clearInterval(this.interval);
                        this.completionCallback(data.resource_id);
                    } else if(data.complete && !data.ok){
                        clearInterval(this.interval);
                        this.failureCallback(data.errors);
                    } else if(this.timeElapsed > 240){
                        clearInterval(this.interval);
                        this.failureCallback("Timeout");
                    }
                    this.timeElapsed += 5;
                }, 5000)
            }
        }
    }

    async completionCallback(id){
        
        this.complete = 100;
        this.bar.innerText = 100;
        this.bar.value = 100;
        let count = 5;
        this.status.innerText = `Complete! Redirecting in ${count}.....`
        switch(this.action){
          case "listings#generate":
            this.nextPath = `/listings/${id}/edit`;
          break;

          case "letters#generate":
            this.nextPath = `/letters/${id}/edit`;
          break;

          case "users#generate":
            const bio = JSON.parse(this.messages);
            const params = new URLSearchParams(bio).toString();
            this.nextPath = `/users/${id}/edit?`+params;
            console.log("")
          break;

          default:
            this.nextPath = "/";
        }

        setTimeout(() => {
          window.location.href = window.location.origin + this.nextPath;
        }, 5000);
        setInterval(() => {
          this.status.innerText = `Complete! Redirecting in ${--count}`+'.'.repeat(count);
        }, 990);

    }

    failureCallback(error){
        console.error("Request Failed: ", error);
        console.log(this);
        this.status.innerText = "ERROR";
        const tryAgain = document.createElement("button");
        tryAgain.classList.add("btn");
        tryAgain.classList.add("btn-primary");
        tryAgain.innerText = "Try Again?";
        tryAgain.addEventListener("click", (e) => {
            this.container.append(this.originalForm);
            this.bar.remove();
            this.status.remove();
            tryAgain.remove();
        })
        this.container.append(tryAgain);
    }
}

function ajaxSubmit(e){
    e.preventDefault();
    const form = e.target;
    const method = form.querySelector("input[name=_method]") ? form.querySelector("input[name=_method]").value : form.method;
    const options = { method, body: {}, headers: {} };
    options.headers["Content-Type"] = "application/json";
    
    const inputs = form.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      if(!input.name) return;
      switch(input.type){
        case "radio":
          if(input.checked) options.body[input.name] = input.value;
          break;

        case "file":
          options.body = new FormData();
          options.body.append('file', input.files[0]);
          options.headers["Content-Type"] = 'application/pdf';
          break;

        default:
          if (input.name === "authenticity_token"){
            options.headers["X-CSRF-Token"] = input.value
          } 
          else {
            options.body[input.name] = input.value
          };
      }
    });
    if(options.headers["Content-Type"] === "application/json") options.body = JSON.stringify(options.body);
    
    new LoadingBar(
      form, //Form Element to be relplaced
      form.action, // Fetch URL
      options, // Method, Body, Headers
      form.dataset?.action // i.e. data-action="letters#generate"
    );
}