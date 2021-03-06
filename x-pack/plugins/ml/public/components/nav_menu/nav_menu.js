/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */



import _ from 'lodash';
import $ from 'jquery';
import template from './nav_menu.html';
import uiRouter from 'ui/routes';
import { isFullLicense } from '../../license/check_license';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml');

module.directive('mlNavMenu', function (breadcrumbState, config) {
  return {
    restrict: 'E',
    transclude: true,
    template,
    link: function (scope, el, attrs) {



      // Tabs
      scope.name = attrs.name;

      scope.showTabs = false;
      if (scope.name === 'jobs' ||
        scope.name === 'settings' ||
        scope.name === 'datavisualizer' ||
        scope.name === 'filedatavisualizer' ||
        scope.name === 'timeseriesexplorer' ||
        scope.name === 'explorer') {
        scope.showTabs = true;
      }
      scope.isActiveTab = function (path) {
        return scope.name === path;
      };

      scope.disableLinks = (isFullLicense() === false);

      // Breadcrumbs
      const crumbNames = {
        jobs: { label: 'Job Management', url: '#/jobs' },
        new_job: { label: 'Create New Job', url: '#/jobs/new_job' },
        single_metric: { label: 'Single Metric Job', url: '' },
        multi_metric: { label: 'Multi Metric job', url: '' },
        population: { label: 'Population job', url: '' },
        advanced: { label: 'Advanced Job Configuration', url: '' },
        datavisualizer: { label: 'Data Visualizer', url: '' },
        filedatavisualizer: { label: 'File Data Visualizer', url: '' },
        explorer: { label: 'Anomaly Explorer', url: '#/explorer' },
        timeseriesexplorer: { label: 'Single Metric Viewer', url: '#/timeseriesexplorer' },
        settings: { label: 'Settings', url: '#/settings' },
        calendars_list: { label: 'Calendar Management', url: '#/settings/calendars_list' },
        new_calendar: { label: 'New Calendar', url: '#/settings/calendars_list/new_calendar' },
        edit_calendar: { label: 'Edit Calendar', url: '#/settings/calendars_list/edit_calendar' },
        filter_lists: { label: 'Filter Lists', url: '#/settings/filter_lists' },
        new_filter_list: { label: 'New Filter List', url: '#/settings/filter_lists/new' },
        edit_filter_list: { label: 'Edit Filter List', url: '#/settings/filter_lists/edit' },
      };

      const breadcrumbs = [{ label: 'Machine Learning', url: '#/' }];

      // get crumbs from url
      const crumbs = uiRouter.getBreadcrumbs();
      _.each(crumbs, (crumb) => {
        breadcrumbs.push(crumbNames[crumb.id]);
      });
      scope.breadcrumbs = breadcrumbs.filter(Boolean);

      config.watch('k7design', (val) => scope.showPluginBreadcrumbs = !val);
      breadcrumbState.set(scope.breadcrumbs.map(b => ({ text: b.label, href: b.url })));

      // when the page loads, focus on the first breadcrumb
      el.ready(() => {
        const $crumbs = $('.kuiLocalBreadcrumbs a');
        if ($crumbs.length) {
          $crumbs[0].focus();
        }
      });
    }
  };
});
