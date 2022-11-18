export const Constants = {
  Site: {
    title: 'Engine | Flito.io'
    // icon:
  },
  TeamMemberTypes: [
    {
      title: 'Admin',
      description:
        'Admins have access to most features with the ability to make changes'
    },
    {
      title: 'Developer',
      description:
        'Developers can see roadmaps, dashboard and suggest features to admins'
    }
  ],
  ActivityStatus: ['Active', 'Pending Invite'],
  ApplicationFormats: ['Client App', 'Admin App', 'Super Admin App'],
  BuildPhases: ['MVP', 'V1'],
  BuildPhase: {
    MVP: 'MVP',
    V1: 'V1'
  },
  PlatformTypes: [
    { id: 0, title: 'Web' },
    { id: 1, title: 'Android' },
    { id: 2, title: 'iOS' },
    { id: 3, title: 'watchOS' },
    { id: 2, title: 'tvOS' }
  ],
  LoadingState: {
    LOADING: 0,
    SUCCESS: 1,
    ERROR: -1
  },
  MemberRoles: [
    {
      id: 0,
      title: 'Front-End Engineer'
    },
    {
      id: 1,
      title: 'Back-End Engineer'
    },
    {
      id: 2,
      title: 'DevOps Engineer'
    },
    {
      id: 3,
      title: 'Unit-Tester'
    },
    {
      id: 4,
      title: 'Project Manager'
    },
    {
      id: 5,
      title: 'Virtual Assistant'
    },
    {
      id: 6,
      title: 'HR Manager'
    }
  ],

  WidgetCode:
    `  <iframe
    src='https://widget.flito.io'
    style='border: none; min-height: 500px;'
    width='100%'
    sandbox='allow-forms allow-scripts'>
  </iframe>`
}


export const devTeam = [
  {
    fullName: 'Aousaf Rashid',
    role: 'Front-End Developer',
    weekHours: 35,
    salary: {
      type: 'hourly',
      rate: 35
    }
  },
  {
    fullName: 'Stephen Carl',
    role: 'Front-End Developer',
    weekHours: 35,
    salary: {
      type: 'hourly',
      rate: 40
    }
  },
  {
    fullName: 'Farhad Jaman',
    role: 'Back-End Developer',
    weekHours: 35,
    salary: {
      type: 'hourly',
      rate: 40
    }
  },
  {
    fullName: 'Farhad Jaman',
    role: 'UI-Designer',
    weekHours: 50,
    salary: {
      type: 'hourly',
      rate: 70
    }
  },
  {
    fullName: 'Faizur Rahman',
    role: 'UX-Designer',
    weekHours: 50,
    salary: {
      type: 'hourly',
      rate: 70
    }
  }
]