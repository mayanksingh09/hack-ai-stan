create policy "allow anon users to upload and read j9xh9j_0"
on "storage"."objects"
as permissive
for insert
to anon
with check (((bucket_id = 'hack-ai-public-storage-bucket'::text) AND ((storage.foldername(name))[1] = 'videos'::text)));


create policy "allow anon users to upload and read j9xh9j_1"
on "storage"."objects"
as permissive
for select
to anon
using (((bucket_id = 'hack-ai-public-storage-bucket'::text) AND ((storage.foldername(name))[1] = 'videos'::text)));



