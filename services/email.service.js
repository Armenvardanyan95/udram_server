const mailer = require('nodemailer');
const Rx = require('rxjs');


class EmailService {

    constructor() {
        this.transporter = mailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    buildEmail(text, preview = '') {
        return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Simple Transactional Email</title>
    <style>
      /* -------------------------------------
          GLOBAL RESETS
      ------------------------------------- */
      img {
        border: none;
        -ms-interpolation-mode: bicubic;
        max-width: 100%; }
      body {
        background-color: #f6f6f6;
        font-family: sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 14px;
        line-height: 1.4;
        margin: 0;
        padding: 0;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%; }
      table {
        border-collapse: separate;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        width: 100%; }
        a {
           color: forestgreen !important;
           text-decoration: none;
        }
        table td {
          font-family: sans-serif;
          font-size: 14px;
          vertical-align: top; }
      /* -------------------------------------
          BODY & CONTAINER
      ------------------------------------- */
      .body {
        background-color: #f6f6f6;
        width: 100%; }
      /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
      .container {
        display: block;
        Margin: 0 auto !important;
        /* makes it centered */
        max-width: 580px;
        padding: 10px;
        width: 580px; }
      /* This should also be a block element, so that it will fill 100% of the .container */
      .content {
        box-sizing: border-box;
        display: block;
        Margin: 0 auto;
        max-width: 580px;
        padding: 10px; }
      /* -------------------------------------
          HEADER, FOOTER, MAIN
      ------------------------------------- */
      .main {
        background: #ffffff;
        border-radius: 3px;
        width: 100%; }
      .wrapper {
        box-sizing: border-box;
        padding: 20px; }
      .content-block {
        padding-bottom: 10px;
        padding-top: 10px;
      }
      .footer {
        clear: both;
        Margin-top: 10px;
        text-align: center;
        width: 100%; }
        .footer td,
        .footer p,
        .footer span,
        .footer a {
          color: #999999;
          font-size: 12px;
          text-align: center; }
      /* -------------------------------------
          TYPOGRAPHY
      ------------------------------------- */
      h1,
      h2,
      h3,
      h4 {
        color: #000000;
        font-family: sans-serif;
        font-weight: 400;
        line-height: 1.4;
        margin: 0;
        Margin-bottom: 30px; }
      h1 {
        font-size: 35px;
        font-weight: 300;
        text-align: center;
        text-transform: capitalize; }
      p,
      ul,
      ol {
        font-family: sans-serif;
        font-size: 14px;
        font-weight: normal;
        margin: 0;
        Margin-bottom: 15px; }
        p li,
        ul li,
        ol li {
          list-style-position: inside;
          margin-left: 5px; }
      /* -------------------------------------
          BUTTONS
      ------------------------------------- */
      .btn {
        box-sizing: border-box;
        width: 100%; }
        .btn > tbody > tr > td {
          padding-bottom: 15px; }
        .btn table {
          width: auto; }
        .btn table td {
          background-color: #ffffff;
          border-radius: 5px;
          text-align: center; }
        .btn a {
          background-color: #ffffff;
          border: solid 1px #3498db;
          border-radius: 5px;
          box-sizing: border-box;
          color: #3498db;
          cursor: pointer;
          display: inline-block;
          font-size: 14px;
          font-weight: bold;
          margin: 0;
          padding: 12px 25px;
          text-decoration: none;
          text-transform: capitalize; }
      .btn-primary table td {
        background-color: #3498db; }
      .btn-primary a {
        background-color: #3498db;
        border-color: #3498db;
        color: #ffffff; }
      /* -------------------------------------
          OTHER STYLES THAT MIGHT BE USEFUL
      ------------------------------------- */
      .last {
        margin-bottom: 0; }
      .first {
        margin-top: 0; }
      .align-center {
        text-align: center; }
      .align-right {
        text-align: right; }
      .align-left {
        text-align: left; }
      .clear {
        clear: both; }
      .mt0 {
        margin-top: 0; }
      .mb0 {
        margin-bottom: 0; }
      .preheader {
        color: transparent;
        display: none;
        height: 0;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
        mso-hide: all;
        visibility: hidden;
        width: 0; }
      .powered-by a {
        text-decoration: none; }
      hr {
        border: 0;
        border-bottom: 1px solid #f6f6f6;
        Margin: 20px 0; }
      /* -------------------------------------
          RESPONSIVE AND MOBILE FRIENDLY STYLES
      ------------------------------------- */
      @media only screen and (max-width: 620px) {
        table[class=body] h1 {
          font-size: 28px !important;
          margin-bottom: 10px !important; }
        table[class=body] p,
        table[class=body] ul,
        table[class=body] ol,
        table[class=body] td,
        table[class=body] span,
        table[class=body] a {
          font-size: 16px !important; }
        table[class=body] .wrapper,
        table[class=body] .article {
          padding: 10px !important; }
        table[class=body] .content {
          padding: 0 !important; }
        table[class=body] .container {
          padding: 0 !important;
          width: 100% !important; }
        table[class=body] .main {
          border-left-width: 0 !important;
          border-radius: 0 !important;
          border-right-width: 0 !important; }
        table[class=body] .btn table {
          width: 100% !important; }
        table[class=body] .btn a {
          width: 100% !important; }
        table[class=body] .img-responsive {
          height: auto !important;
          max-width: 100% !important;
          width: auto !important; }}
      /* -------------------------------------
          PRESERVE THESE STYLES IN THE HEAD
      ------------------------------------- */
      @media all {
        .ExternalClass {
          width: 100%; }
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
          line-height: 100%; }
        .apple-link a {
          color: inherit !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          text-decoration: none !important; }
        .btn-primary table td:hover {
          background-color: #34495e !important; }
        .btn-primary a:hover {
          background-color: #34495e !important;
          border-color: #34495e !important; } }
    </style>
  </head>
  <body class="">
    <table border="0" cellpadding="0" cellspacing="0" class="body">
      <tr>
        <td>&nbsp;</td>
        <td class="container">
          <div class="content">

            <!-- START CENTERED WHITE CONTAINER -->
            <span class="preheader">${preview}</span>
            <table class="main">
            
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" data-name="Layer 4" width="479.9999911444529" height="162.85712860068452" style=""><rect id="backgroundrect" width="100%" height="100%" x="0" y="0" fill="none" stroke="none" class="" style=""/><defs><style>.cls-1{fill:url(#linear-gradient);}.cls-2{fill:url(#linear-gradient-2);}.cls-3{fill:url(#linear-gradient-3);}.cls-4{fill:url(#linear-gradient-4);}.cls-5{fill:url(#linear-gradient-5);}.cls-6{fill:url(#linear-gradient-6);}.cls-7{fill:url(#linear-gradient-7);}.cls-8{fill:url(#linear-gradient-8);}.cls-9{fill:url(#linear-gradient-9);}.cls-10{fill:#ededed;}</style><linearGradient id="linear-gradient" x1="645.0499877929688" y1="448.2200012207031" x2="707.9500122070312" y2="448.2200012207031" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffff6a"/><stop offset="0.02" stop-color="#fcf866"/><stop offset="0.11" stop-color="#f4e25b"/><stop offset="0.22" stop-color="#edd153"/><stop offset="0.34" stop-color="#e8c54c"/><stop offset="0.52" stop-color="#e6be49"/><stop offset="1" stop-color="#e5bc48"/></linearGradient><linearGradient id="linear-gradient-2" x1="258.30999755859375" y1="473.19000244140625" x2="274.67999267578125" y2="473.19000244140625" xlink:href="#linear-gradient"/><linearGradient id="linear-gradient-3" x1="426.29998779296875" y1="472.69000244140625" x2="714.2999877929688" y2="472.69000244140625" xlink:href="#linear-gradient"/><linearGradient id="linear-gradient-4" x1="322.760009765625" y1="473.19000244140625" x2="409.760009765625" y2="473.19000244140625" xlink:href="#linear-gradient"/><linearGradient id="linear-gradient-5" x1="271.92999267578125" y1="473.19000244140625" x2="358.92999267578125" y2="473.19000244140625" xlink:href="#linear-gradient"/><linearGradient id="linear-gradient-6" x1="297.3399963378906" y1="447.7799987792969" x2="384.3399963378906" y2="447.7799987792969" xlink:href="#linear-gradient"/><linearGradient id="linear-gradient-7" x1="297.3399963378906" y1="498.6000061035156" x2="384.3399963378906" y2="498.6000061035156" xlink:href="#linear-gradient"/><linearGradient id="linear-gradient-8" x1="419.4700012207031" y1="472.69000244140625" x2="424.3900146484375" y2="472.69000244140625" xlink:href="#linear-gradient"/><linearGradient id="linear-gradient-9" x1="412.04998779296875" y1="472.69000244140625" x2="416.9700012207031" y2="472.69000244140625" xlink:href="#linear-gradient"/></defs><title>u_dram_6</title><g class="currentLayer" style=""><title>Layer 1</title><path class="cls-1" d="M397.8571319580078,38.97285278320311 H460.8571319580078 a0,0 0 0 1 0,0 v29.11 a3.67,3.67 0 0 1 -3.67,3.67 H401.57713195800784 a3.67,3.67 0 0 1 -3.67,-3.67 V38.97285278320311 A0,0 0 0 1 397.8571319580078,38.97285278320311 z" id="svg_1"/><path class="cls-2" d="M19.34713195800782,88.52285278320312 a8.19,8.19 0 1 1 8.19,-8.19 A8.2,8.2 0 0 1 19.34713195800782,88.52285278320312 zm0,-12.870000000000001 a4.69,4.69 0 1 0 4.69,4.69 A4.69,4.69 0 0 0 19.34713195800782,75.64285278320312 z" id="svg_2"/><path class="cls-3" d="M179.15713195800782,76.83285278320312 h285 a3,3 0 0 1 3,3 v0 a3,3 0 0 1 -3,3 h-285 a0,0 0 0 1 0,0 v-6 a0,0 0 0 1 0,0 z" id="svg_3"/><path class="cls-4" d="M119.1171319580078,123.83285278320318 a43.5,43.5 0 1 1 43.5,-43.5 A43.55,43.55 0 0 1 119.1171319580078,123.83285278320318 zm0,-83 a39.5,39.5 0 1 0 39.5,39.5 A39.54,39.54 0 0 0 119.1171319580078,40.83285278320312 z" id="svg_4"/><path class="cls-5" d="M68.28713195800782,123.83285278320318 a43.5,43.5 0 1 1 43.5,-43.5 A43.55,43.55 0 0 1 68.28713195800782,123.83285278320318 zm0,-83 a39.5,39.5 0 1 0 39.5,39.5 A39.54,39.54 0 0 0 68.28713195800782,40.83285278320312 z" id="svg_5"/><path class="cls-6" d="M93.69713195800779,98.4228527832031 a43.5,43.5 0 1 1 43.5,-43.5 A43.55,43.55 0 0 1 93.69713195800779,98.4228527832031 zm0,-83 a39.5,39.5 0 1 0 39.5,39.5 A39.54,39.54 0 0 0 93.69713195800779,15.422852783203098 z" id="svg_6"/><path class="cls-7" d="M93.69713195800779,149.24285278320315 a43.5,43.5 0 1 1 43.5,-43.5 A43.55,43.55 0 0 1 93.69713195800779,149.24285278320315 zm0,-83 a39.5,39.5 0 1 0 39.5,39.5 A39.54,39.54 0 0 0 93.69713195800779,66.24285278320315 z" id="svg_7"/><rect class="cls-8" x="172.32713317871094" y="74.5428466796875" width="4.920000076293945" height="10.569999694824219" rx="2.4600000381469727" ry="2.4600000381469727" id="svg_8"/><rect class="cls-9" x="164.90711975097656" y="72.25283813476562" width="4.920000076293945" height="15.170000076293945" rx="2.4600000381469727" ry="2.4600000381469727" id="svg_9"/><rect class="cls-10" x="406.40711975097656" y="38.97283935546875" width="15" height="15" id="svg_10"/><rect class="cls-10" x="439.4771270751953" y="38.97283935546875" width="12.600000381469727" height="15" id="svg_11"/></g></svg>
              <!-- START MAIN CONTENT AREA -->
              <tr>
                <td class="wrapper">
                  <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p>Բարեվ Ձեզ</p>
                        <p>${text}</p>
                        <p>Շնորհակալություն UDram-ի ծառայություններից օգտվելու համար</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            <!-- END MAIN CONTENT AREA -->
            </table>

            <!-- START FOOTER -->
            <div class="footer">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="content-block">
                    <span class="apple-link">UDram վարկային միջնորդ, ք․ Երևան, Դավիթաշեն, 3 թաղ, 19/3 (ավտոպարկ)</span>
                  </td>
                </tr>
              </table>
            </div>
            <!-- END FOOTER -->

          <!-- END CENTERED WHITE CONTAINER -->
          </div>
        </td>
        <td>&nbsp;</td>
      </tr>
    </table>
  </body>
</html>`
    }

    registrationEmail(fullName, email) {
        const mailOptions = {
            to: email,
            from: process.env.EMAIL,
            subject: 'Ձեր գրանցումը հաջողվել է',
            html: this.buildEmail(`Հարգելի ${fullName}, Դուք հաջողությամբ գրանցվել եք UDram համակարգում։ Ձեր հայտը շուտով կուսումնասիրվի և դուք կստանաք ծանուցում`, 'Ձեր գրանցումը հաջողվել է')
        };

        this.transporter.sendMail(mailOptions);
    }

    rejectMail(fullName, email) {
        const mailOptions = {
            to: email,
            from: process.env.EMAIL,
            subject: 'Ձեր գրանցումը հաջողվել է',
            html: this.buildEmail(`Հարգելի ${fullName}, Ձեր տվյալները մանրակրկիտ ուսումնասիրելով, Udram վարկային միջնորդ կազմակերպությունը եկավ այն եզրահանգման, որ տվյալ հատկանիշներով Ձեզ հնարավոր չէ տրամադրել ցանկալի գումարը։  \n Շնորհակալություն UDram-ին դիմելու համար`)
        };
        console.log(fullName, email, 'drrrr')
        this.transporter.sendMail(mailOptions);
    }

    approveMail(fullName, email) {
        const mailOptions = {
            to: email,
            from: process.env.EMAIL,
            subject: 'Ձեր գրանցումը հաջողվել է',
            html: this.buildEmail(`Հարգելի ${fullName} Ձեր հայտը ընդունվել է Udram կազմակերպության կողմից։ Այցելեք Udram կազմակերպության գրասենյակ (Դավիթաշեն, Եղվարթի խճ․ , Ավտոպարկ կամ զանգահարեք )`)
        };
        this.transporter.sendMail(mailOptions);
    }

    forgotPasswordEmail(email, fullName, url) {
        const mailOptions = {
            to: email,
            from: process.env.EMAIL,
            subject: 'Դուք մոռացել եք Ձեր գաղտնաբառը',
            html: this.buildEmail(`Հարգելի ${fullName}, Ձեր գաղտնաբառը վերականագնելու համար անցեք հետեվյալ <a href="${url}">հղումով</a> <br><br> Եթե դուք չեք պահանջել գաղտնաբառի վերականգնում, ապա ուղղակի անտեսեք այս նամակը`, `Գաղտնաբառի վերականգնում`),
        };

        this.transporter.sendMail(mailOptions);
    }

}

module.exports = EmailService;