module.exports = {
  types: [
      {value: 'feature',  name: 'feature:  新增功能'},
      {value: 'bug',      name: 'bug:      测试反馈bug列表中的bug号'},
      {value: 'fix',      name: 'fix:      修复bug'},
      {value: 'ui',       name: 'ui:       更新UI'},
      {value: 'docs',     name: 'docs:     文档变更'},
      {value: 'style',    name: 'style:    代码格式（不影响功能，例如空格、分号等格式修正）'},
      {value: 'perf',     name: 'perf:     性能优化'},
      {value: 'refactor', name: 'refactor: 代码重构（不包括 bug 修复、功能新增）'},
      {value: 'release',  name: 'release:  发布'},
      {value: 'deploy',   name: 'deploy:   部署'},
      {value: 'test',     name: 'test:     添加、修改测试用例'},
      {value: 'chore',    name: 'chore:    对构建过程或辅助工具和库的更改（不影响源文件、测试用例）'},
      {value: 'revert',   name: 'revert:   回滚 commit'},
      {value: 'build',    name: 'build:    构建流程、外部依赖变更（如升级 npm 包、修改 脚手架 配置等）'},
      {value: 'wip',      name:'wip:       开发中' }
  ],
  scopes: [
    ['custom', '自定义'],
		['projects', '项目搭建'],
    ['components', '组件相关'],
    ['utils', 'utils 相关'],
    ['styles', '样式相关'],
    ['deps', '项目依赖'],
    ['other', '其他修改'],
  ].map(([value, description]) => {
    return {
      value,
      name: `${value.padEnd(30)} (${description})`
    }
  }),
  // override the messages, defaults are as follows
  messages: {
    type: '确保本次提交遵循 Angular 规范！选择你要提交的类型：\n',
    scope: '选择一个 scope（可选）：',
    customScope: '请输入自定义的 scope：',
    subject: '填写简短精炼的变更描述：',
    body: '填写更加详细的变更描述（可选）。使用 "|" 换行：',
    breaking: '列举非兼容性重大的变更（可选）：',
    footer: '列举出所有变更的 Issues Closed（可选）。 例如: #31, #34：',
    confirmCommit: '确认提交？'
  },
  // allowCustomScopes: true,
  // skipQuestions: ['body', 'footer'],
  allowBreakingChanges: ['feat', 'fix'],
  subjectLimit: 100,
  breaklineChar: '|'
};
