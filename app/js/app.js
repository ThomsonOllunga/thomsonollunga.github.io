function get_json(){
  $.get("./app/json/site.json", function(data){
	  stuff(data);
  });
}
function stuff(data){
	set_title(data);
    	set_navs(data);
    	set_logo(data);
	set_about(data);
	set_contact(data);
	set_search_data(data);
	set_picture_and_general_contact(data);
}
function set_about(data){
	var content_sections = data["content-sections"];
	$.each(content_sections, function(key, value){
		if(value["section"] == "about"){
			var div = $("<div/>");
			var body = $("<h1/>");

			$(div).addClass("container").addClass("about-section");
			$(body).addClass("container").addClass("about-section");
			$(div).append($(body));

			$(".about").append($(div));

			var section_details = value["section-details"][0];
			var content = section_details["content"];
			var item = content[0];
			$(body).text(item["item-content"])
		}
	});
	$(".about").css("min-height",$(window).height());
}
function get_section(data, section_name){
	var content_sections = data["content-sections"];
        var section_details, specialties;
        $.each(content_sections, function(index, value){
                if(value["section"] == section_name){
                        section_details = value["section-details"];
                }
        });
	return section_details
}
function set_picture_and_general_contact(data){
	var section_name = "general_inquiries";
	var section_details = get_section(data, section_name);
	var section_documents = section_details["documents"];

	var contacts_row = $("<div/>");

	$.each(section_documents, function(index, value) {
		var contact_image = $("<img/>");
                var specialties = value["specialties"];
                var phone_number = value["contact_details"]["phone_number"];
                var email_address = value["contact_details"]["email_address"];
		var address_city = value["contact_details"]["address_city"];
		var address_state = value["contact_details"]["address_state"];

		var contact_card = $("<div/>");
                contacts_row.addClass("contacts-row").addClass("d-flex").addClass("flex-row").addClass("justify-content-around").addClass("flex-wrap");
                contact_card.addClass("contact-card");
                contact_card.load("./app/html/general_inquiries_contact_card.tmpl", function(){
			$(this).find(".phone_number").text(phone_number);
                        var phone_number_to_dial = phone_number.replace(/-/g,"").replace(/x/g,"#").replace(/ /g,"");
                        $(this).find(".phone_number").attr("href","tel:+1" + phone_number_to_dial);
                        $(this).find(".email_address").text(email_address);
                        $(this).find(".email_address").attr("href","mailto:" + email_address);
			$(this).find(".address-street").text(address_city);
			$(this).find(".address-state-zip").text(address_state);
			$(".picture-secondary").append($(this));
		});

	});
	if ($(window).width() >= 1440){
		$(".picture-secondary").height($(window).height() - $(".navbar").height() - ($(".blog-footer").height()*2.25));
	}else if ($(window).width() > 1024 && $(window).width() < 1440){
		$(".picture-secondary").height($(window).height() - $(".navbar").height() - ($(".blog-footer").height()*2.5));
	}else{
		$(".picture-secondary").height($(window).height() - $(".navbar").height() - ($(".blog-footer").height()*1.75));
	}
}
function set_contact(data){
	var section_name = "specialties";
	var section_details = get_section(data, section_name);
	var section_documents = section_details["documents"];

	var contacts = $(".contacts_cards");
	var contacts_row = $("<div/>");
	
	$.each(section_documents, function(index, value){
		var contact_card = $("<div/>");
		contacts_row.addClass("contacts-row").addClass("d-flex").addClass("flex-row").addClass("justify-content-around").addClass("flex-wrap");
		contact_card.addClass("contact-card").addClass("col-xl-2").addClass("col-lg-3").addClass("col-md-5").addClass("col-sm-5").addClass("col-xs-12");
		contact_card.load("./app/html/contact_card.tmpl", function(){
			var contact_image = $("<img/>");
			var image_path = "./app/images/" + value["contact_details"]["image"];
			var specialties = value["specialties"];
			var phone_number = value["contact_details"]["phone_number"];
			var email_address = value["contact_details"]["email_address"];
			var name = value["contact_details"]["name"];
			var position = value["contact_details"]["position"];
			
			try{
				$(this).find(".name").text(name);
				$(this).find(".position").text(position);
			}finally{
				$(this).find(".phone_number").text(phone_number);
				var phone_number_to_dial = phone_number.replace(/-/g,"").replace(/x/g,"#").replace(/ /g,"");
				$(this).find(".phone_number").attr("href","tel:+1" + phone_number_to_dial);
				$(this).find(".email_address").text(email_address);
				$(this).find(".email_address").attr("href","mailto:" + email_address);
			}
		});

		$(contacts_row).append(contact_card);

		if((index + 1)%4 == 0){
			$(contacts).append($(contacts_row));
			contacts_row = $("<div/>");
			contacts_row.addClass("contacts-row");
		}else if(index == 4){
			$(contacts).append($(contacts_row));
		}
	});
}
function set_search_data(data){
	var content_sections = data["content-sections"];
	var specialties_section_details, specialties;
	$.each(content_sections, function(index, value){
		if(value["section"] == "specialties"){
			specialties_section_details = value["section-details"];
		}
	});
	specialties = specialties_section_details["documents"];
	$.each(specialties, function(index, value){
		var doc = value;
		search_index.addDoc(doc);
	});
}
function set_title(data){
  $("site-title").text(data["site-title"]);
}
function set_navs(data){
 $.each(data["content-sections"], function(key, value){
   console.log(key);
   var link = $("<a/>");
   link.text();
   $(".nav").append(link);
 });
}
function set_logo(data){
  		var len_nav = $(".nav").children.length;
  		var half_len_nav = Math.floor(len_nav/2);
  		var div = $("<div/>");
  		$(div).addClass("d-flex");
  		$(div).addClass("justify-content-center");
  		var wrapper = $("<div/>");
  		$(wrapper).addClass("brand");
  		var image = $("<img/>");
  		$(image).attr("src","app/images/" + data["site-logo"]);
  		$(image).addClass("heading-logo");
  		$(wrapper).append($(image));
  		$(div).append($(wrapper));
  		var insertion_point = $(".nav").children()[half_len_nav];
  		$(insertion_point).before(div);
}
var search_index = elasticlunr(function () {
    this.addField('specialties');
    this.addField('contact_details');
    this.setRef('id');
});
$(document).ready(function(){
  get_json();
});
window.onorientationchange = function(){
	var orientation = window.orientation;
	switch(orientation) {
		case 0:
		case 90:
		case -90: window.location.reload();	
		break;
	}
}
