// import '@fortawesome/fontawesome-free/js/fontawesome';
// import '@fortawesome/fontawesome-free/js/solid';

import tippy from 'tippy.js';
// Import our custom CSS
import '../scss/styles.scss';

// Import all of Bootstrap's JS
import 'bootstrap';
import {
    App
} from '@wazo/euc-plugins-sdk';

const version = '© [AIV]{date}[/AIV] FM - Pour ATEA-Com - [AIV]v{version}[/AIV]';
document.getElementsByClassName("copy")[0].innerHTML = version;

const app = new App();
 let template_sip_global_data_uuid = "";
 let template_sip_webrtc_data_uuid = "";
 let apps_list = "";
 let host;
 let tenant_uuid;
 let token_session;
 let transport_name;
 let transport_uuid;
 let template_global_uuid;
 let template_registration_uuid;

 const btn_submit = document.getElementsByClassName("wizard_save");
 const get_username = document.getElementById("username");
 const get_password = document.getElementById("password");




for (let element of btn_submit) {
    element.addEventListener("click", async function(e) {
        let key = (Math.random() + 1).toString(36).substring(7);
        let trunk_username = get_username.value;
        let trunk_password = get_password.value;
        let body_trunk = {
                "twilio_incoming": false,
                "endpoint_sip": {
                "label": "SipRouter",
                "name": "siprouter_trunk_"+key+"_"+tenant_uuid,
                "auth_section_options": [],
                "registration_section_options": [
                    [
                    "client_uri",
                    "sip:"+trunk_username+"@siprouter.ate-com.fr"
                    ]
                ]
                },
                "endpoint_custom": null,
                "endpoint_iax": null,
                "register_iax": null,
                "label": "SipRouter",
                "endpoint_section_options": [
                [
                    "identify_by",
                    "header,auth_username,username"
                ],
                [
                    "allow",
                    "!all,alaw"
                ],
                [
                    "contact_user",
                    trunk_username
                ],
                [
                    "rewrite_contact",
                    "no"
                ],
                [
                    "rtp_symmetric",
                    "no"
                ],
                [
                    "direct_media",
                    "no"
                ]
                ],
                "auth_section_options": [],
                "identify_section_options": [
                [
                    "match_header",
                    "Contact: /<sip:"+trunk_username+"@.*>/"
                ],
                [
                    "match",
                    "siprouter.ate-com.fr"
                ]
                ],
                "registration_section_options": [
                [
                    "contact_user",
                    trunk_username
                ],
                [
                    "expiration",
                    "60"
                ],
                [
                    "line",
                    "yes"
                ],
                [
                    "client_uri",
                    "sip:"+trunk_username+"@siprouter.ate-com.fr"
                ],
                [
                    "server_uri",
                    "sip:siprouter.ate-com.fr:5060"
                ]
                ],
                "registration_outbound_auth_section_options": [
                [
                    "username",
                    trunk_username
                ],
                [
                    "password",
                    trunk_password
                ]
                ],
                "outbound_auth_section_options": [
                [
                    "username",
                    trunk_username
                ],
                [
                    "password",
                    trunk_password
                ]
                ],
                "aor_section_options": [
                [
                    "contact",
                    "sip:"+trunk_username+"@siprouter.ate-com.fr"
                ]
                ],
                "host_type": "static",
                "protocol": "sip",
                "name": "siprouter_trunk_"+key+"_"+tenant_uuid,
                "isManualOptionForm": true,
                "templates": [
                    {
                        "uuid": template_global_uuid
                      },
                      {
                        "uuid": template_registration_uuid
                      }
                ]
        };
        const create_trunk = await fetch(host+"/api/confd/1.1/trunks", {
        "headers": {
        "accept": "application/json",
        "content-type": "application/json",
        "wazo-tenant": tenant_uuid,
        "x-auth-token": token_session,
        },
        "body": JSON.stringify(body_trunk),
        "method": "POST"
        }).then(response => response.json());
        console.log(create_trunk);
        console.log(create_trunk.id);

        let body_endpoint = {
            "label": "SipRouter",
            "name": "siprouter_trunk_"+key+"_"+tenant_uuid,
            "transport": {
              "uuid": transport_uuid
            },
            "templates": [
              {
                "uuid": template_global_uuid
              },
              {
                "uuid": template_registration_uuid
              }
            ],
            "endpoint_section_options": [
                [
                "identify_by",
                "header,auth_username,username"
                ],
                [
                "allow",
                "!all,alaw"
                ],
                [
                "contact_user",
                trunk_username
                ],
                [
                "rewrite_contact",
                "no"
                ],
                [
                    "rtp_symmetric",
                    "no"
                ],
                [
                    "direct_media",
                    "no"
                ]
            ],
            "registration_section_options": [
              [
                "contact_user",
                trunk_username
              ],
              [
                "expiration",
                "60"
              ],
              [
                "line",
                "yes"
              ],
              [
                "client_uri",
                "sip:"+trunk_username+"@siprouter.ate-com.fr:5060"
              ],
              [
                "server_uri",
                "sip:siprouter.ate-com.fr:5060"
              ]
            ],
            "registration_outbound_auth_section_options": [
              [
                "username",
                trunk_username
              ],
              [
                "password",
                trunk_password
              ]
            ],
            "outbound_auth_section_options": [
              [
                "username",
                trunk_username
              ],
              [
                "password",
                trunk_password
              ]
            ],
            "aor_section_options": [
              [
                "contact",
                "sip:"+trunk_username+"@siprouter.ate-com.fr:5060"
              ]
            ],
            "identify_section_options": [
              [
                "match_header",
                "Contact: /<sip:"+trunk_username+"@.*>/"
              ],
              [
                "match",
                "siprouter.ate-com.fr"
              ]
            ],
            "protocol": "sip"
        };
        const create_endpoint = await fetch(host+"/api/confd/1.1/endpoints/sip", {
            "headers": {
              "accept": "application/json",
              "content-type": "application/json",
              "wazo-tenant": tenant_uuid,
              "x-auth-token": token_session,
            },
            "body": JSON.stringify(body_endpoint),
            "method": "POST"
          }).then(response => response.json());
        console.log(create_endpoint);
        console.log(create_endpoint.uuid);

        const associate_trunk = await fetch(host+"/api/confd/1.1/trunks/"+create_trunk.id+"/endpoints/sip/"+create_endpoint.uuid, {
            "headers": {
            "accept": "application/json",
            "content-type": "application/json",
            "wazo-tenant": tenant_uuid,
            "x-auth-token": token_session,
            },
            "method": "PUT",
        }).catch(console.error);

        btn_submit[0].innerHTML = "Terminé";
        btn_submit[0].disabled = true;
        get_password.disabled = true;
        get_username.disabled = true;

        })

        

}



(async () => {
    await app.initialize();
    const context = app.getContext();
    console.log("CONTEXT");
    console.log(context);
    
    tenant_uuid = context.app.extra.tenant;
    console.log("TENANT UUID");
    console.log(tenant_uuid);
    console.log("APP");
    host = 'https://' + context.app.extra.stack.host;
    token_session = context.app.extra.stack.session.token;

    const get_transport = await fetch(host+"/api/confd/1.1/sip/transports?search=transport-udp", {
        "headers": {
          "accept": "application/json",
          "x-auth-token": token_session
        },
        "method": "GET",
    })
    .then((response) => response.json())
    .then((data) => {
      for (const product of data.items) {
        transport_uuid = product.uuid;
        transport_name = product.name;
      }
    })
    .catch(console.error);
    console.log("TRANSPORT");
    console.log(transport_name);
    console.log(transport_uuid);
    console.log("FIN TRANSPORT");

    const get_template = await fetch(host+"/api/confd/1.1/endpoints/sip/templates", {
        "headers": {
            "accept": "application/json",
            "wazo-tenant": tenant_uuid,
            "x-auth-token": token_session,
        },
        "method": "GET"
    })
    .then((response) => response.json())
    .then((data) => {
        let array = data.items;
        for (let template = 0; template < array.length; template++) {
            const element = array[template];
            if (element.label === "global") {
                template_global_uuid = element.uuid;
            }
            if (element.label === "registration_trunk") {
                template_registration_uuid = element.uuid;
            }
        }
    })
    .catch(console.error);
    console.log("TEMPLATES");
    console.log(template_global_uuid);
    console.log(template_registration_uuid);
    console.log("FIN TEMPLATES");

    
    
})();