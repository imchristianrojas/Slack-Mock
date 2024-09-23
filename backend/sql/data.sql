
DELETE FROM user_profile;
DELETE FROM workspaces;
DELETE FROM channels;
DELETE FROM workspace_members;

-- Add two users
INSERT INTO user_profile (user_data) VALUES (jsonb_build_object('name', 'Molly Skywalker','email', 'molly@books.com','password', crypt('mollymember', gen_salt('bf')),'status', 'Active'));
INSERT INTO user_profile (user_data) VALUES (jsonb_build_object('name', 'Darth Anna','email', 'anna@books.com','password', crypt('annaadmin', gen_salt('bf')),'status', 'Away'));

-- Add five workspaces (including the new Coruscant workspace)
INSERT INTO workspaces (workspace_data) VALUES (jsonb_build_object('name', 'Jedi Council')),(jsonb_build_object('name', 'Rebel Alliance')),(jsonb_build_object('name', 'Galactic Empire')),(jsonb_build_object('name', 'Bounty Hunters Guild')),(jsonb_build_object('name', 'Coruscant'));

-- Add channels to each workspace
-- Jedi Council
INSERT INTO channels (workspace_id, channel_data) SELECT id, jsonb_build_object('name', channel_name, 'description', 'A channel for Jedi matters','content', ARRAY[jsonb_build_object('from', 'Obi Wan', 'message', 'I am Obi Wan!'),jsonb_build_object('from', 'Yoda', 'message', 'I am Yoda!')]) FROM workspaces, unnest(ARRAY['Force Training', 'Lightsaber Techniques', 'Jedi Code', 'Meditation']) AS channel_name WHERE (workspace_data->>'name') = 'Jedi Council';

-- Rebel Alliance
INSERT INTO channels (workspace_id, channel_data) SELECT id, jsonb_build_object('name', channel_name, 'description', 'A channel for Rebel operations') FROM workspaces, unnest(ARRAY['Mission Briefings', 'Intelligence Reports', 'Starfighter Squadrons', 'Recruitment']) AS channel_name WHERE (workspace_data->>'name') = 'Rebel Alliance';

-- Galactic Empire
INSERT INTO channels (workspace_id, channel_data) SELECT id, jsonb_build_object('name', channel_name, 'description', 'A channel for Imperial business') FROM workspaces, unnest(ARRAY['Death Star Plans', 'Stormtrooper Training', 'Imperial Navy', 'Sith Apprenticeship']) AS channel_name WHERE (workspace_data->>'name') = 'Galactic Empire';

-- Bounty Hunters Guild
INSERT INTO channels (workspace_id, channel_data) SELECT id, jsonb_build_object('name', channel_name, 'description', 'A channel for bounty hunter affairs') FROM workspaces, unnest(ARRAY['Wanted Targets', 'Equipment Exchange', 'Job Postings', 'Guild Rules']) AS channel_name WHERE (workspace_data->>'name') = 'Bounty Hunters Guild';

-- Coruscant (new workspace with a single channel)
INSERT INTO channels (workspace_id, channel_data) SELECT id, jsonb_build_object('name', 'General Chat', 'description', 'A channel for both Sith and Jedi','content', ARRAY[jsonb_build_object('from', 'Darth Maul', 'message', 'Hello')]) FROM workspaces WHERE (workspace_data->>'name') = 'Coruscant';

-- Add workspace memberships
INSERT INTO workspace_members (workspace_id, user_id) SELECT w.id, u.id FROM workspaces w, user_profile u WHERE (w.workspace_data->>'name') IN ('Jedi Council', 'Rebel Alliance', 'Bounty Hunters Guild', 'Coruscant') AND (u.user_data->>'name') = 'Molly Skywalker';
INSERT INTO workspace_members (workspace_id, user_id) SELECT w.id, u.id FROM workspaces w, user_profile u WHERE (w.workspace_data->>'name') IN ('Galactic Empire', 'Rebel Alliance', 'Bounty Hunters Guild', 'Coruscant') AND (u.user_data->>'name') = 'Darth Anna';