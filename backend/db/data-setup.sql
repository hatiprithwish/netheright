INSERT INTO roles (id, name) VALUES
  ('LEARNER', 'Learner'),
  ('TESTER',  'App Tester');

INSERT INTO features (id, description, perm_bit, perm_bit_index) VALUES
  ('SKPINTVPH', 'Skip through phases of an interview quickly', 0, 0),
  ('MNGDSHBD',  'Access the user dashboard',                   1, 0),
  ('ATTNDINTV', 'Participate in an interview session',         2, 0);


INSERT INTO role_features (role_id, feature_id) VALUES
  ('TESTER', 'SKPINTVPH'),
  ('TESTER', 'MNGDSHBD'),
  ('TESTER', 'ATTNDINTV'),
  ('LEARNER', 'MNGDSHBD'),
  ('LEARNER', 'ATTNDINTV');

INSERT
	INTO
	problems (
    title,
	  description,
	  functional_requirements,
	  non_functional_requirements,
	  bote_factors,
	  difficulty,
	  tags
)
VALUES 
(
    'Food Delivery App',
    'A high-level system design for a platform connecting customers, restaurants, and delivery partners.',
    ARRAY[
    'Users can search for nearby restaurants and browse menus',
    'Users can place an order and track its status in real-time',
    'Restaurants can manage their menu and accept/reject orders',
    'Delivery partners can accept delivery requests and update order progress'
    ],
    ARRAY[
    'Low latency for order tracking and searching',
    'High availability (the system must not go down during peak meal times)',
    'Scalability to handle millions of concurrent users and orders',
    'High consistency for payments and order statuses'
    ],
    ARRAY[
    'Daily Active Users (DAU): 10 Million',
	'Orders per Day: 1 Million',
	'Geographic: Multi-region',
	'Order status & location tracking: 5-second updates'
	],
    'Medium',
    ARRAY[
    'Microservices',
	'Geo Sharding'
    ]
),
(
    'Social Media Feed',
    'A high-scale system for real-time microblogging, following users, and generating personalized news feeds.',
    ARRAY[
    'Users can post tweets (text, images, video)',
    'Users can follow/unfollow other users',
    'Users can view a global or personalized timeline of tweets',
    'Users can search for tweets by keywords or hashtags'
    ],
    ARRAY[
    'High availability (eventual consistency is acceptable for timelines)',
    'Low latency for timeline generation (< 200ms)',
    'Scalability to handle massive spikes (breaking news events)',
    'Durability of posted content'
    ],
    ARRAY[
    'Daily Active Users (DAU): 300 Million',
	'Tweets per Day: 500 Million',
	'Average Follower Count: 200',
	'Celebrity Follower Count: 50 Million+',
	'Read/Write Ratio: 100:1 (Read-heavy)'
    ],
    'Hard',
    ARRAY[
    'Distributed Systems',
	'Fan Out'
    ]
);