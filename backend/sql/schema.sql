-- Drop existing tables
DROP TABLE IF EXISTS user_profile CASCADE;
DROP TABLE IF EXISTS workspaces CASCADE;
DROP TABLE IF EXISTS channels CASCADE;
DROP TABLE IF EXISTS workspace_members CASCADE;

-- Create users table
CREATE TABLE user_profile (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),user_data JSONB);

-- Create workspaces table with JSONB column
CREATE TABLE workspaces (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),workspace_data JSONB);

-- Create channels table with JSONB column and foreign key to workspaces
CREATE TABLE channels (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),workspace_id UUID NOT NULL,channel_data JSONB,FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE);

-- Create join table to link users to workspaces
CREATE TABLE workspace_members (workspace_id UUID,user_id UUID,PRIMARY KEY (workspace_id, user_id),FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,FOREIGN KEY (user_id) REFERENCES user_profile(id) ON DELETE CASCADE);

