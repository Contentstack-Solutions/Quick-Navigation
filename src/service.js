export const getAllContentTypes = (extension,stackData ) => {
  
  console.log(extension,stackData)
    let url;
    
      url =  "https://api.contentstack.io/v3/content_types?include_count=false&include_global_field_schema=true";
    
    return fetch(
      url, {
        method: "GET",
        mode: "cors", 
        cache: "no-cache", 
        credentials: "same-origin", 
        headers: {
          "Content-Type": "application/json", 
          api_key: stackData.api_key, // appended Api Key
          //access_token: process.env.REACT_APP_Delivery_Token, //appened Delivery Token
          authorization: extension.config.managementToken
        },
        redirect: "follow", 
        referrerPolicy: "no-referrer",
      }).then(res => res.json())
  };