INSERT INTO roles (id, name) VALUES
  ('LEARNER', 'Learner'),
  ('TESTER',  'App Tester');

INSERT INTO features (id, description, perm_bit, perm_bit_index) VALUES
  ('SKIP_INTV_PHASE', 'Skip through phases of an interview quickly', 0, 0),
  ('MANAGE_DASHBRD',  'Access the user dashboard',                   1, 0),
  ('ATTEND_INTV',     'Participate in an interview session',         2, 0);


INSERT INTO role_features (role_id, feature_id) VALUES
  ('TESTER', 'SKIP_INTV_PHASE'),
  ('TESTER', 'MANAGE_DASHBRD'),
  ('TESTER', 'ATTEND_INTV'),
  ('LEARNER', 'MANAGE_DASHBRD'),
  ('LEARNER', 'ATTEND_INTV');
