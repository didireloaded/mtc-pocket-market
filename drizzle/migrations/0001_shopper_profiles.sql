CREATE TABLE public.profiles (id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, display_name text NOT NULL DEFAULT '', avatar_url text NOT NULL DEFAULT '', preferences jsonb NOT NULL DEFAULT '{}'::jsonb, created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT,UPDATE ON public.profiles TO authenticated; GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_profile_read ON public.profiles FOR SELECT TO authenticated USING(id=auth.uid());
CREATE POLICY own_profile_update ON public.profiles FOR UPDATE TO authenticated USING(id=auth.uid()) WITH CHECK(id=auth.uid());
CREATE FUNCTION public.create_shopper_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN INSERT INTO public.profiles(id,display_name) VALUES(NEW.id,coalesce(NEW.raw_user_meta_data->>'full_name','')) ON CONFLICT(id) DO NOTHING; RETURN NEW; END $$;
CREATE TRIGGER create_shopper_profile AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.create_shopper_profile();
INSERT INTO public.profiles(id,display_name) SELECT id,coalesce(raw_user_meta_data->>'full_name','') FROM auth.users ON CONFLICT(id) DO NOTHING;