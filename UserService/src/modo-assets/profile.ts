export interface UserProfileType {
  userImageUrl: string;
  firstName: string;
  lastName: string;
  gender: string;
  major: string[];
  birthday: Date;
  description: string;
}

export function userProfileNotFound() {
  return {
    content: [
      {
        height: 'fluid',
        content: [
          {
            image: {
              url: 'https://cdn3.freelogovectors.net/wp-content/uploads/2020/04/california-state-university-fresno-logo.png',
            },
            imageSize: '155px',
            marginTop: '1rem',
            elementType: 'heroImage',
            horizontalAlignment: 'center',
          },
          {
            image: {
              url: 'https://static.vecteezy.com/system/resources/previews/020/168/700/original/faceless-male-silhouette-empty-state-avatar-icon-businessman-editable-404-not-found-persona-for-ux-ui-design-cartoon-profile-picture-with-red-dot-colorful-website-mobile-error-user-badge-vector.jpg',
            },
            imageSize: '78px',
            marginTop: '-5rem',
            elementType: 'heroImage',
            marginBottom: 'xxtight',
            horizontalAlignment: 'center',
          },
          {
            marginTop: '.5rem',
            textColor: '#000000',
            subheading: 'User Not Found',
            elementType: 'heroSubheading',
            marginBottom: 'none',
            textAlignment: 'center',
            fontFamily: 'cursive',
          },
          {
            subheading: 'Gender',
            marginTop: 'none',
            textColor: '#000000',
            marginLeft: '1rem',
            elementType: 'heroSubheading',
            marginRight: '1rem',
            marginBottom: '0.5rem',
            textAlignment: 'center',
            fontFamily: 'cursive',
          },
          {
            subheading: 'Major',
            marginTop: 'none',
            textColor: '#000000',
            marginLeft: '1rem',
            elementType: 'heroSubheading',
            marginRight: '1rem',
            marginBottom: '0.5rem',
            textAlignment: 'center',
            fontFamily: 'cursive',
          },
          {
            body: 'Date of Birth',
            marginTop: 'none',
            textColor: '#000000',
            marginLeft: '1rem',
            elementType: 'heroBody',
            marginRight: '1rem',
            marginBottom: '0.5rem',
            textAlignment: 'center',
            fontFamily: 'cursive',
          },
          {
            body: 'Description',
            marginTop: 'none',
            textColor: '#000000',
            marginLeft: '1rem',
            elementType: 'heroBody',
            marginRight: '1rem',
            marginBottom: '0.5rem',
            textAlignment: 'center',
            fontFamily: 'cursive',
          },
        ],
        elementType: 'hero',
        backgroundImage: {
          overlayType: 'solid',
          overlayColor: 'white',
        },
        contentContainerWidth: 'narrow',
      },
      {
        borderColor: 'transparent',
        elementType: 'divider',
      },
      {
        elementType: 'buttonGroup',
        fullWidth: true,
        buttons: [
          {
            elementType: 'linkButton',
            size: 'large',
            borderColor: '#FFFFFF',
            title: 'discover',
            link: {
              relativePath: '../eccedf5f322d15450c36',
            },
          },
          {
            elementType: 'linkButton',
            size: 'large',
            borderColor: '#FFFFFF',
            title: 'profile',
            link: {
              relativePath: '../733ad84f20dd1aac31da',
            },
          },
          {
            elementType: 'linkButton',
            size: 'large',
            borderColor: '#FFFFFF',
            title: 'Chat',
            link: {
              relativePath: '../f2e1a58ab1607cd422e1',
            },
          },
        ],
      },
    ],
    metadata: {
      version: '2.0',
    },
    contentContainerWidth: 'full',
  };
}

export function userProfileSelf(user: UserProfileType) {
  return {
    metadata: {
      version: '2.0',
    },
    contentContainerWidth: 'full',
    content: [
      {
        height: 'fluid',
        content: [
          {
            image: {
              url: 'https://cdn3.freelogovectors.net/wp-content/uploads/2020/04/california-state-university-fresno-logo.png',
            },
            imageSize: '155px',
            marginTop: '-1rem',
            elementType: 'heroImage',
            marginBottom: 'xxtight',
            horizontalAlignment: 'center',
          },
          {
            image: {
              url: user.userImageUrl,
            },
            imageSize: '78px',
            marginTop: '-5rem',
            elementType: 'heroImage',
            marginBottom: 'xxtight',
            horizontalAlignment: 'center',
          },
          {
            marginTop: '.5rem',
            textColor: '#000000',
            subheading: `${user.firstName} ${user.lastName}`,
            elementType: 'heroSubheading',
            marginBottom: 'none',
            textAlignment: 'center',
            fontFamily: 'cursive',
          },
          {
            subheading: `${user.gender}`,
            marginTop: 'none',
            textColor: '#000000',
            marginLeft: '1rem',
            elementType: 'heroSubheading',
            marginRight: '1rem',
            marginBottom: '0.5rem',
            textAlignment: 'center',
            fontFamily: 'cursive',
          },
          {
            subheading: `${user.major}`, // TODO: possible [] return
            marginTop: 'none',
            textColor: '#000000',
            marginLeft: '1rem',
            elementType: 'heroSubheading',
            marginRight: '1rem',
            marginBottom: '0.5rem',
            textAlignment: 'center',
            fontFamily: 'cursive',
          },
          {
            body: `${user.birthday}`,
            marginTop: 'none',
            textColor: '#000000',
            marginLeft: '1rem',
            elementType: 'heroBody',
            marginRight: '1rem',
            marginBottom: '0.5rem',
            textAlignment: 'center',
            fontFamily: 'cursive',
          },
          {
            body: `${user.description}`,
            marginTop: 'none',
            textColor: '#000000',
            marginLeft: '1rem',
            elementType: 'heroBody',
            marginRight: '1rem',
            marginBottom: '0.5rem',
            textAlignment: 'center',
            fontFamily: 'cursive',
          },
        ],
        elementType: 'hero',
        backgroundImage: {
          overlayType: 'solid',
          overlayColor: 'white',
        },
        contentContainerWidth: 'narrow',
      },
      {
        borderColor: 'transparent',
        elementType: 'divider',
      },
      {
        elementType: 'buttonGroup',
        fullWidth: true,
        buttons: [
          {
            elementType: 'linkButton',
            size: 'large',
            borderColor: '#FFFFFF',
            title: 'discover',
            link: {
              relativePath: '../eccedf5f322d15450c36',
            },
          },
          {
            elementType: 'linkButton',
            size: 'large',
            borderColor: '#FFFFFF',
            title: 'profile',
            link: {
              relativePath: '../733ad84f20dd1aac31da',
            },
          },
          {
            elementType: 'linkButton',
            size: 'large',
            borderColor: '#FFFFFF',
            title: 'Chat',
            link: {
              relativePath: '../f2e1a58ab1607cd422e1', //TODO
            },
          },
        ],
      },
    ],
  };
}

export function userProfileOther(user: UserProfileType) {
  return {
    content: [
      {
        height: 'fluid',
        content: [
          {
            image: {
              url: 'https://cdn3.freelogovectors.net/wp-content/uploads/2020/04/california-state-university-fresno-logo.png',
            },
            imageSize: '155px',
            marginTop: '1rem',
            elementType: 'heroImage',

            horizontalAlignment: 'center',
          },
          {
            image: {
              url: user.userImageUrl,
            },
            imageSize: '78px',
            marginTop: '-5rem',
            elementType: 'heroImage',
            marginBottom: 'xxtight',
            horizontalAlignment: 'center',
          },
          {
            marginTop: '.5rem',
            textColor: '#000000',
            subheading: `${user.firstName} ${user.lastName}`,
            elementType: 'heroSubheading',
            marginBottom: 'none',
            textAlignment: 'center',
            fontFamily: 'cursive',
          },
          {
            subheading: `${user.gender}`,
            marginTop: 'none',
            textColor: '#000000',
            marginLeft: '1rem',
            elementType: 'heroSubheading',
            marginRight: '1rem',
            marginBottom: '0.5rem',
            textAlignment: 'center',
            fontFamily: 'cursive',
          },
          {
            subheading: `${user.major}`, // TODO: possible [] return
            marginTop: 'none',
            textColor: '#000000',
            marginLeft: '1rem',
            elementType: 'heroSubheading',
            marginRight: '1rem',
            marginBottom: '0.5rem',
            textAlignment: 'center',
            fontFamily: 'cursive',
          },
          {
            body: `${user.birthday}`,
            marginTop: 'none',
            textColor: '#000000',
            marginLeft: '1rem',
            elementType: 'heroBody',
            marginRight: '1rem',
            marginBottom: '0.5rem',
            textAlignment: 'center',
            fontFamily: 'cursive',
          },
          {
            body: `${user.description}`,
            marginTop: 'none',
            textColor: '#000000',
            marginLeft: '1rem',
            elementType: 'heroBody',
            marginRight: '1rem',
            marginBottom: '0.5rem',
            textAlignment: 'center',
            fontFamily: 'cursive',
          },
          {
            buttons: [
              {
                title: 'Add/Remove Friend', // TODO
                textColor: '#FFA500',
                borderColor: '#4169E1',
                borderWidth: '2px',
                borderRadius: 'full',
                elementType: 'linkButton',
                backgroundColor: 'white',
              },
            ],
            marginTop: 'none',
            elementType: 'heroButtons',
            marginBottom: '0.5rem',
            horizontalAlignment: 'center',
          },
          {
            buttons: [
              {
                title: 'Block User',
                textColor: '#FFA500',
                borderColor: '#4169E1',
                borderWidth: '2px',
                elementType: 'linkButton',
                backgroundColor: 'white',
                borderRadius: 'full',
              },
            ],
            marginTop: 'none',
            elementType: 'heroButtons',
            marginBottom: '0.5rem',
            horizontalAlignment: 'center',
          },
        ],
        elementType: 'hero',
        backgroundImage: {
          overlayType: 'solid',
          overlayColor: 'white',
        },
        contentContainerWidth: 'narrow',
      },
      {
        borderColor: 'transparent',
        elementType: 'divider',
      },
      {
        elementType: 'buttonGroup',
        fullWidth: true,
        buttons: [
          {
            elementType: 'linkButton',
            size: 'large',
            borderColor: '#FFFFFF',
            title: 'discover',
            link: {
              relativePath: '../eccedf5f322d15450c36', //TODO
            },
          },
          {
            elementType: 'linkButton',
            size: 'large',
            borderColor: '#FFFFFF',
            title: 'profile',
            link: {
              relativePath: '../733ad84f20dd1aac31da',
            },
          },
          {
            elementType: 'linkButton',
            size: 'large',
            borderColor: '#FFFFFF',
            title: 'Chat',
            link: {
              relativePath: '../f2e1a58ab1607cd422e1',
            },
          },
        ],
      },
    ],
    metadata: {
      version: '2.0',
    },
    contentContainerWidth: 'full',
  };
}
