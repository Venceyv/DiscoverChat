export interface UserProfileType {
  _id: string;
  userImageUrl: string;
  firstName: string;
  lastName: string;
  gender: string;
  major: string[];
  birthday: Date;
  description: string;
}

export interface UserProfileTypeWithID extends UserProfileType {
  _id: string;
  isFriend: boolean;
  isBlock: boolean;
}
// !profile not found
export function userProfileNotFound() {
  return {
    content: [
      {
        height: "fluid",
        content: [
          {
            image: {
              url: "https://cdn3.freelogovectors.net/wp-content/uploads/2020/04/california-state-university-fresno-logo.png",
            },
            imageSize: "155px",
            marginTop: "1rem",
            elementType: "heroImage",
            horizontalAlignment: "center",
          },
          {
            image: {
              url: "https://static.vecteezy.com/system/resources/previews/020/168/700/original/faceless-male-silhouette-empty-state-avatar-icon-businessman-editable-404-not-found-persona-for-ux-ui-design-cartoon-profile-picture-with-red-dot-colorful-website-mobile-error-user-badge-vector.jpg",
            },
            imageSize: "78px",
            marginTop: "-5rem",
            elementType: "heroImage",
            marginBottom: "xxtight",
            horizontalAlignment: "center",
          },
          {
            marginTop: ".5rem",
            textColor: "#000000",
            subheading: "User Not Found",
            elementType: "heroSubheading",
            marginBottom: "none",
            textAlignment: "center",
            fontFamily: "cursive",
          },
          {
            subheading: "Gender",
            marginTop: "none",
            textColor: "#000000",
            marginLeft: "1rem",
            elementType: "heroSubheading",
            marginRight: "1rem",
            marginBottom: "0.5rem",
            textAlignment: "center",
            fontFamily: "cursive",
          },
          {
            subheading: "Major",
            marginTop: "none",
            textColor: "#000000",
            marginLeft: "1rem",
            elementType: "heroSubheading",
            marginRight: "1rem",
            marginBottom: "0.5rem",
            textAlignment: "center",
            fontFamily: "cursive",
          },
          {
            body: "Date of Birth",
            marginTop: "none",
            textColor: "#000000",
            marginLeft: "1rem",
            elementType: "heroBody",
            marginRight: "1rem",
            marginBottom: "0.5rem",
            textAlignment: "center",
            fontFamily: "cursive",
          },
          {
            body: "Description",
            marginTop: "none",
            textColor: "#000000",
            marginLeft: "1rem",
            elementType: "heroBody",
            marginRight: "1rem",
            marginBottom: "0.5rem",
            textAlignment: "center",
            fontFamily: "cursive",
          },
        ],
        elementType: "hero",
        backgroundImage: {
          overlayType: "solid",
          overlayColor: "white",
        },
        contentContainerWidth: "narrow",
      },
      {
        borderColor: "transparent",
        elementType: "divider",
      },
      {
        elementType: "buttonGroup",
        fullWidth: true,
        buttons: [
          {
            elementType: "linkButton",
            size: "large",
            borderColor: "#FFFFFF",
            title: "discover",
            link: {
              relativePath: "../eccedf5f322d15450c36",
            },
          },
          {
            elementType: "linkButton",
            size: "large",
            borderColor: "#FFFFFF",
            title: "profile",
            link: {
              relativePath: "../733ad84f20dd1aac31da",
            },
          },
          {
            elementType: "linkButton",
            size: "large",
            borderColor: "#FFFFFF",
            title: "Chat",
            link: {
              relativePath: "../f2e1a58ab1607cd422e1",
            },
          },
        ],
      },
    ],
    metadata: {
      version: "2.0",
    },
    contentContainerWidth: "full",
  };
}

// !self
export function userProfileSelf(user: UserProfileType) {
  return {
    metadata: {
      version: "2.0",
    },
    contentContainerWidth: "full",
    content: [
      {
        height: "fluid",
        content: [
          {
            image: {
              url: "https://cdn3.freelogovectors.net/wp-content/uploads/2020/04/california-state-university-fresno-logo.png", //学校的logo
            },
            imageSize: "155px",
            marginTop: "responsive",
            elementType: "heroImage",
            marginBottom: "xxtight",
            horizontalAlignment: "center",
          },
          {
            image: {
              url: user.userImageUrl,
            },
            imageSize: "78px",
            marginTop: "-5rem",
            elementType: "heroImage",
            marginBottom: "xxtight",
            horizontalAlignment: "center",
          },
          {
            marginTop: ".5rem",
            textColor: "#000000",
            subheading: `${user.firstName} ${user.lastName}`,
            elementType: "heroSubheading",
            marginBottom: "none",
            textAlignment: "center",
            fontFamily: "cursive",
          },
          {
            subheading: `${user.gender}`,
            marginTop: "none",
            textColor: "#000000",
            marginLeft: "1rem",
            elementType: "heroSubheading",
            marginRight: "1rem",
            marginBottom: "0.5rem",
            textAlignment: "center",
          },
          {
            subheading: `${user.major[0]}`, //TODO: major is array, right now only 1 major max
            marginTop: "none",
            textColor: "#000000",
            marginLeft: "1rem",
            elementType: "heroSubheading",
            marginRight: "1rem",
            marginBottom: "0.5rem",
            textAlignment: "center",
          },
          {
            body: `${user.description}`,
            marginTop: "none",
            textColor: "#000000",
            marginLeft: "1rem",
            elementType: "heroBody",
            marginRight: "1rem",
            marginBottom: "0.5rem",
            textAlignment: "center",
          },
        ],
        elementType: "hero",
        backgroundImage: {
          overlayType: "solid",
          overlayColor: "white",
        },
        contentContainerWidth: "narrow",
      },
      {
        borderColor: "transparent",
        elementType: "divider",
      },
      {
        elementType: "buttonGroup",
        fullWidth: true,
        buttons: [
          {
            elementType: "linkButton",
            size: "large",
            borderColor: "#FFFFFF",
            title: "discover",
            link: {
              relativePath: "../discover/discoverPage", //TODO: discover endpoint
            },
          },
          {
            elementType: "linkButton",
            size: "large",
            borderColor: "#FFFFFF",
            title: "profile",
            link: {
              relativePath: `../user/${user._id}`, //TODO: profile endpoint
            },
          },
          {
            elementType: "linkButton",
            size: "large",
            borderColor: "#FFFFFF",
            title: "Chat",
            link: {
              relativePath: "../chatList", //TODO: link chat endpoint
            },
          },
        ],
      },
    ],
  };
}

// !other
export function userProfileInBlock(user: UserProfileTypeWithID, requesterId: string) {
  return {
    content: [
      {
        height: "fluid",
        content: [
          {
            elementType: "heroButtons",
            horizontalAlignment: "left",
            buttons: [
              {
                borderWidth: "2px",
                borderRadius: "loose",
                accessoryIcon: "dropleft",
                elementType: "linkButton",
                backgroundColor: "#ffffff",
                link: {
                  relativePath: "../chatList",
                },
              },
            ],
          },
          {
            image: {
              url: "https://cdn3.freelogovectors.net/wp-content/uploads/2020/04/california-state-university-fresno-logo.png",
            },
            imageSize: "155px",
            marginTop: "-7rem",
            elementType: "heroImage",
            horizontalAlignment: "center",
          },
          {
            image: {
              url: user.userImageUrl,
            },
            imageSize: "78px",
            marginTop: "-3rem",
            elementType: "heroImage",
            marginBottom: "xxtight",
            horizontalAlignment: "center",
          },
          {
            marginTop: ".5rem",
            textColor: "#000000",
            subheading: user.lastName + " " + user.firstName,
            elementType: "heroSubheading",
            marginBottom: "none",
            textAlignment: "center",
          },

          //*TODO: dont include gender when is stranger profile?
          // {
          //   subheading: 'Male',
          //   marginTop: 'none',
          //   textColor: '#000000',
          //   marginLeft: '1rem',
          //   elementType: 'heroSubheading',
          //   marginRight: '1rem',
          //   marginBottom: '0.5rem',
          //   textAlignment: 'center',
          // },
          {
            subheading: "Computer Science",
            marginTop: "none",
            textColor: "#000000",
            marginLeft: "1rem",
            elementType: "heroSubheading",
            marginRight: "1rem",
            marginBottom: "0.5rem",
            textAlignment: "center",
          },

          // TODO: dont include birthday when is stranger profile?
          // {
          //   body: 'January 11',
          //   marginTop: 'none',
          //   textColor: '#000000',
          //   marginLeft: '1rem',
          //   elementType: 'heroBody',
          //   marginRight: '1rem',
          //   marginBottom: '0.5rem',
          //   textAlignment: 'center',
          // },

          {
            body: user.description,
            marginTop: "none",
            textColor: "#000000",
            marginLeft: "1rem",
            elementType: "heroBody",
            marginRight: "1rem",
            marginBottom: "0.5rem",
            textAlignment: "center",
          },
          {
            buttons: [
              {
                title: "Unblock",
                link: {
                  relativePath:  `../blockList/unBlock/${user._id}`,
                },
                textColor: "#FFA500",
                borderColor: "#4169E1",
                borderWidth: "2px",
                elementType: "linkButton",
                backgroundColor: "white",
                borderRadius: "full",
              },
            ],
            marginTop: "none",
            elementType: "heroButtons",
            marginBottom: "0.5rem",
            horizontalAlignment: "center",
          },
        ],
        elementType: "hero",
        backgroundImage: {
          overlayType: "solid",
          overlayColor: "white",
        },
        contentContainerWidth: "narrow",
      },
      {
        borderColor: "transparent",
        elementType: "divider",
      },
      {
        elementType: "buttonGroup",
        fullWidth: true,
        buttons: [
          {
            elementType: "linkButton",
            size: "large",
            borderColor: "#FFFFFF",
            marginTop: "responsive",
            title: "discover",
            link: {
              relativePath: "../discover/discoverPage", //TODO: link to discover self
            },
          },
          {
            elementType: "linkButton",
            size: "large",
            borderColor: "#FFFFFF",
            marginTop: "responsive",
            title: "profile",
            link: {
              relativePath: `../user/${requesterId}`, //TODO: link to profile self
            },
          },
          {
            elementType: "linkButton",
            size: "large",
            borderColor: "#FFFFFF",
            marginTop: "responsive",
            title: "Chat",
            link: {
              relativePath: "../chatList", //TODO: link to chat self
            },
          },
        ],
      },
    ],
    metadata: {
      version: "2.0",
    },
    contentContainerWidth: "full",
  };
}

export function userProfileOther(user: UserProfileTypeWithID, requesterId: string) {
  return {
    content: [
      {
        height: "fluid",
        content: [
          {
            elementType: "heroButtons",
            horizontalAlignment: "left",
            buttons: [
              {
                borderWidth: "2px",
                borderRadius: "loose",
                accessoryIcon: "dropleft",
                elementType: "linkButton",
                backgroundColor: "#ffffff",
                link: {
                  relativePath: "../chatList",
                },
              },
            ],
          },
          {
            image: {
              url: "https://cdn3.freelogovectors.net/wp-content/uploads/2020/04/california-state-university-fresno-logo.png",
            },
            imageSize: "155px",
            marginTop: "-7rem",
            elementType: "heroImage",
            horizontalAlignment: "center",
          },
          {
            image: {
              url: user.userImageUrl,
            },
            imageSize: "78px",
            marginTop: "-3rem",
            elementType: "heroImage",
            marginBottom: "xxtight",
            horizontalAlignment: "center",
          },
          {
            marginTop: ".5rem",
            textColor: "#000000",
            subheading: user.lastName + " " + user.firstName,
            elementType: "heroSubheading",
            marginBottom: "none",
            textAlignment: "center",
          },

          //*TODO: dont include gender when is stranger profile?
          // {
          //   subheading: 'Male',
          //   marginTop: 'none',
          //   textColor: '#000000',
          //   marginLeft: '1rem',
          //   elementType: 'heroSubheading',
          //   marginRight: '1rem',
          //   marginBottom: '0.5rem',
          //   textAlignment: 'center',
          // },
          {
            subheading: "Computer Science",
            marginTop: "none",
            textColor: "#000000",
            marginLeft: "1rem",
            elementType: "heroSubheading",
            marginRight: "1rem",
            marginBottom: "0.5rem",
            textAlignment: "center",
          },

          // TODO: dont include birthday when is stranger profile?
          // {
          //   body: 'January 11',
          //   marginTop: 'none',
          //   textColor: '#000000',
          //   marginLeft: '1rem',
          //   elementType: 'heroBody',
          //   marginRight: '1rem',
          //   marginBottom: '0.5rem',
          //   textAlignment: 'center',
          // },

          {
            body: user.description,
            marginTop: "none",
            textColor: "#000000",
            marginLeft: "1rem",
            elementType: "heroBody",
            marginRight: "1rem",
            marginBottom: "0.5rem",
            textAlignment: "center",
          },
          {
            buttons: [
              {
                title: user.isFriend ? "Remove Friend" : "Add Friend", // TODO: check
                link: {
                  relativePath: user.isFriend ? `../room/delete/${user._id}` : `../room/add/${user._id}`,
                },
                textColor: "#FFA500",
                borderColor: "#4169E1",
                borderWidth: "2px",
                borderRadius: "full",
                elementType: "linkButton",
                backgroundColor: "white",
              },
            ],
            marginTop: "none",
            elementType: "heroButtons",
            marginBottom: "0.5rem",
            horizontalAlignment: "center",
          },
          {
            buttons: [
              {
                title: user.isBlock ? "Unblock" : "Block User",
                link: {
                  relativePath: user.isBlock ? `../blockList/unBlock/${user._id}` : `../blockList/block/${user._id}`,
                },
                textColor: "#FFA500",
                borderColor: "#4169E1",
                borderWidth: "2px",
                elementType: "linkButton",
                backgroundColor: "white",
                borderRadius: "full",
              },
            ],
            marginTop: "none",
            elementType: "heroButtons",
            marginBottom: "0.5rem",
            horizontalAlignment: "center",
          },
        ],
        elementType: "hero",
        backgroundImage: {
          overlayType: "solid",
          overlayColor: "white",
        },
        contentContainerWidth: "narrow",
      },
      {
        borderColor: "transparent",
        elementType: "divider",
      },
      {
        elementType: "buttonGroup",
        fullWidth: true,
        buttons: [
          {
            elementType: "linkButton",
            size: "large",
            borderColor: "#FFFFFF",
            marginTop: "responsive",
            title: "discover",
            link: {
              relativePath: "../discover/discoverPage", //TODO: link to discover self
            },
          },
          {
            elementType: "linkButton",
            size: "large",
            borderColor: "#FFFFFF",
            marginTop: "responsive",
            title: "profile",
            link: {
              relativePath: `../user/${requesterId}`, //TODO: link to profile self
            },
          },
          {
            elementType: "linkButton",
            size: "large",
            borderColor: "#FFFFFF",
            marginTop: "responsive",
            title: "Chat",
            link: {
              relativePath: "../chatList", //TODO: link to chat self
            },
          },
        ],
      },
    ],
    metadata: {
      version: "2.0",
    },
    contentContainerWidth: "full",
  };
}
