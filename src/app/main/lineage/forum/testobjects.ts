import { PostModel } from './post.model';
export const dummyPosts: PostModel[] = [
  new PostModel(
    '1',
    false,
    'file1.jpg',
    true,
    'personId1',
    'Post content 1',
    false,
    false,
    'Post Title 1',
    ['user1', 'user2'],
    new Date('Mon Oct 16').toString(),
    [
      {
        userId: {
          id: 'user3',
          firstName: 'User 3',
        },
        date: new Date(),
        comment: 'Comment 1 for Post 1',
        likes: ['user4', 'user5'],
      },
      {
        userId: {
          id: 'user6',
          firstName: 'User 6',
        },
        date: new Date(),
        comment: 'Comment 2 for Post 1',
        likes: ['user7', 'user8'],
      },
    ],
    {
      firstName: 'User 1',
      id: 'user1',
      adminableBy: ['admin1', 'admin2'],
      lineage: [1, 2],
    }
  ),
  new PostModel(
    '2',
    false,
    'file2.jpg',
    true,
    'testUserId', // Replace with a valid user ID
    'Post content 2',
    false,
    false,
    'Post Title 2',
    ['user11', 'user12'], // Replace with valid user IDs
    new Date().toString(),
    null,
    {
      firstName: 'User 2',
      id: 'user2',
    }
  ),
  new PostModel(
    '3',
    true,
    '',
    false,
    '',
    'Post content 3',
    false,
    true,
    'Post Title 3',
    [],
    new Date().toString(),
    null,
    {
      firstName: 'User 2',
      id: 'testUserId',
    }
  ),
  new PostModel(
    '4',
    false,
    'file4.jpg',
    true,
    'personId1',
    'Post content 4',
    false,
    false,
    'Post Title 4',
    ['user9'],
    new Date().toString(),
    null,
    {
      firstName: 'User 4',
      id: 'user4',
      adminableBy: ['admin3'],
    }
  ),
  new PostModel(
    '5',
    false,
    'file5.jpg',
    true,
    'personId5',
    'Post content 5',
    false,
    false,
    'Post Title 5',
    ['user10'],
    new Date().toString(),
    null,
    {
      firstName: 'User 2',
      id: 'testUserId',
    }
  ),
];
