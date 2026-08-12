class ButtonLoader{

    static show(button){

        if(!button) return;

        if(button.classList.contains("btn-loading")) return;

        button.dataset.originalText=button.innerHTML;

        button.innerHTML=`
            <span class="btn-text">
                ${button.dataset.originalText}
            </span>

            <span class="btn-loader"></span>
        `;

        button.disabled=true;

        button.classList.add("btn-loading");

    }

    static hide(button){

        if(!button) return;

        button.innerHTML=button.dataset.originalText;

        button.disabled=false;

        button.classList.remove("btn-loading");

    }

}