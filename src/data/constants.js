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
    { label: 'Front-End Developer', value: 'front-end' },
    { label: 'Back-End Developer', value: 'back-end' },
    { label: 'QA Tester', value: 'qa-tester' },
    { label: 'DevOps Engineer', value: 'devops' },
    { label: 'Project Manager', value: 'project-manager' },
    { label: 'UI Designer', value: 'ui-designer' }
  ],
  MemberEmploymentTypes: [
    { label: 'Full-Time (> 30hrs/week)', value: 'full-time-30-plus' },
    { label: 'Part-Time (< 30hrs/week)', value: 'part-time-30-less' }
  ],
  MemberSalaryTypes: [
    { label: 'Yearly', value: 'yearly' },
    { label: 'Hourly', value: 'hourly' }
  ],

  WidgetCode: `  <iframe
    src='https://widget.flito.io/{widgetCode}'
    style='border: none; min-height: 500px;'
    width='100%'>
  </iframe>`
}
