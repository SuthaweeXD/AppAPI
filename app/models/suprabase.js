const  {createClient}  = require('@supabase/supabase-js')

const supabase = createClient('https://wzyhhjgadswpjjdvslgc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6eWhoamdhZHN3cGpqZHZzbGdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjYwMTI0MDQsImV4cCI6MTk4MTU4ODQwNH0.ldV6OfPcDRG6WUoqPpFTV75O_59fxStliju0pD068bY')
const uploadImage = async (image) =>{
  const { data, error }= await supabase
        .storage
        .from('avatar')
        .upload(Math.random().toString(), image.buffer, { contentType: image.mimetype})
  
  console.log(error);  
  return "https://wzyhhjgadswpjjdvslgc.supabase.co/storage/v1/object/public/"+data.Key
}
module.exports = uploadImage

