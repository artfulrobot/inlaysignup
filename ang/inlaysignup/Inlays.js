(function(angular, $, _) {

  angular.module('inlaysignup').config(function($routeProvider) {
      $routeProvider.when('/inlays/signup/:id', {
        controller: 'InlaysignupInlays',
        controllerAs: '$ctrl',
        templateUrl: '~/inlaysignup/Inlays.html',

        // If you need to look up data when opening the page, list it out
        // under "resolve".
        resolve: {
          various: function($route, crmApi4, $route) {
            const params = {
              inlayTypes: ['InlayType', 'get', {}, 'class'],
              groups: ['Group', 'get', {
                select: ["id", "title"],
                where: [["group_type", "=", 2], ["is_active", "=", true], ["is_hidden", "=", false]],
                orderBy: {"title":"ASC"}
              }],
              messageTpls: [ 'MessageTemplate', 'get', {
                select: ["id", "msg_title", "msg_subject"],
                where: [
                  ["is_active", "=", true], ["is_sms", "=", false],
                  ["workflow_id", "IS NULL"]
                ],
                orderBy: {msg_title: 'ASC'}},
                'id']
            };
            if ($route.current.params.id > 0) {
              params.inlay = ['Inlay', 'get', {where: [["id", "=", $route.current.params.id]]}, 0];
            }
            return crmApi4(params);
          },
        }
      });
    }
  );

  // The controller uses *injection*. This default injects a few things:
  //   $scope -- This is the set of variables shared between JS and HTML.
  //   crmApi, crmStatus, crmUiHelp -- These are services provided by civicrm-core.
  //   myContact -- The current contact, defined above in config().
  angular.module('inlaysignup').controller('InlaysignupInlays', function($scope, $route, crmApi4, crmStatus, crmUiHelp, various) {
    // The ts() and hs() functions help load strings for this module.
    var ts = $scope.ts = CRM.ts('inlaysignup');
    var hs = $scope.hs = crmUiHelp({file: 'CRM/inlaysignup/Inlays'}); // See: templates/CRM/inlaysignup/Inlays.hlp
    let ctrl = this;

    $scope.inlayType = various.inlayTypes['Civi\\Inlay\\InlaySignup'];
    console.log({various}, $scope.inlayType);
    $scope.mailingGroups = various.groups;
    $scope.messageTpls = various.messageTpls;
    if (various.inlay) {
      $scope.inlay = various.inlay;
    }
    else {
      $scope.inlay = {
        'class' : 'Civi\\Inlay\\InlaySignup',
        name: 'New ' + $scope.inlayType.name,
        public_id: 'new',
        id: 0,
        config: JSON.parse(JSON.stringify($scope.inlayType.defaultConfig)),
      };
    }
    const inlay = $scope.inlay;


    $scope.patternCheckResults = [];
    ctrl.patternTestURL = '';
    $scope.checkPatternErrors = () => {
      console.log("check patttern", ctrl.patternTestURL);
      $scope.patternCheckResults = [];
      $scope.inlay.config.notWhenUrlIs.split(/[\r\n]+/).map(pattern => {
        const item = {pattern: pattern, status: 'error'};
        if (pattern[0] === '*') {
          // Support simple patterns where * means any number of chars. Convert that to a regex:
          pattern = pattern.split('*').slice(1).map(part => part.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')).join('.*');
          // console.log("Converted ", {origPat, pattern});
        }
        let re;
        try { re = new RegExp(pattern); }
        catch (e) {}
        if (re) {
          if (ctrl.patternTestURL) {
            item.status = ctrl.patternTestURL.match(re) ? 'matches' : 'nomatch';
          }
          else {
            item.status = 'ok';
          }
        }
        $scope.patternCheckResults.push(item);
      });
    };
    $scope.checkPatternErrors();

    $scope.save = function() {
      return crmStatus(
        // Status messages. For defaults, just use "{}"
        {start: ts('Saving...'), success: ts('Saved')},
        // The save action. Note that crmApi() returns a promise.
        crmApi4('Inlay', 'save', { records: [inlay] })
      ).then(r => {
        console.log("save result", r);
        window.location = CRM.url('civicrm/a?#inlays');
      });
    };
  });

})(angular, CRM.$, CRM._);
