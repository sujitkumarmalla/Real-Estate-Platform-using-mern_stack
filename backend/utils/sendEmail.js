const sendEmail=async(options)=>{
  try {
    const BREVO_API_KEY=process.env.BREVO_API_KEY?.trim();
    if(!BREVO_API_KEY){
        console.error("missing brevo_api_keys in the .env file")
        throw new Error("Missing Email Api key")
    }

    const data={
        sender:{
            name:"Real EState Platform",
            email:process.env.EMAIL_USER
        },
        to:[{
            email:options.email
        }],
        subject:options.subject,
        htmlContent:options.message
    };

    const response=await fetch("https://api.brevo.com/v3/smtp/email",{
        method:"POST",
        headers:{
            "api-key":BREVO_API_KEY,
            "Content-Type":"application/json",
            "Accept":"application/json"
        },
       body:JSON.stringify(data) 
    });

    const result=await response.json();
    if(response.ok){
        console.log("Email sent successfully",result.messageId)
    }else{
        console.log("Bravo API key Error",result);
        throw new Error(result.message || "Could not send email via Bravo")
    }
  } catch (error) {
     console.error("Brevo Email Error", error);
     throw new Error("Could not send email via Brevo");
  }  
}


export default sendEmail;