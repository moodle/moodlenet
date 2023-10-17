// interface DSL{

// }
// export function CreateResourceActivity (_:DSL){

//   before_start_activity(()=>{
//     if(user_is_anonymus()){
//       go_to_login_page_with_return_to_this_activity_on_success()
//     }else if(user_has_permission_to_create_resource()){
//       show_choose_content_view()
//     }else  {
//       view_missing_permission_message()
//     }
//   })choosenContent

//   when_user_chooses_content(()=>{
//     if(is_valid_choosen_content()){
//       upload_content()
//       show_uploading_content_view()
//     }else{
//       show_choose_content_view()
//     }
//   })
// }
