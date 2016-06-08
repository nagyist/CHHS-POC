define(['knockout', 'jquery', 'lodash', 'fullCalendar'], function (ko, $, _) {
  'use strict';

  return function () {

    var appointments = ko.observableArray([
      {start: '2016-04-01T12:00:00',
        end: '2016-05-31T12:00:00',
        title: 'Rehabilitation'
      },
      {start: '2016-06-02T17:00:00',
        end: '2016-06-02T18:00:00',
        title: 'Case worker meeting'
      },
      {start: '2016-06-07T18:00:00',
        end: '2016-06-07T19:00:00',
        title: 'Parenting class'
      },
      {start: '2016-06-09T17:00:00',
        end: '2016-06-09T18:00:00',
        title: 'Case worker meeting'
      },
      {start: '2016-06-14T11:00:00',
        end: '2016-06-14T12:00:00',
        title: 'Parenting class'
      },
      {start: '2016-06-16T17:00:00',
        end: '2016-06-16T18:00:00',
        title: 'Case worker meeting'
      },
      {start: '2016-06-19T13:00:00',
        end: '2016-06-19T15:00:00',
        title: 'Post-rehab meeting'
      },
      {start: '2016-06-21T18:00:00',
        end: '2016-06-21T19:00:00',
        title: 'Parenting class'
      },
      {start: '2016-06-23T17:00:00',
        end: '2016-06-23T18:00:00',
        title: 'Case worker meeting'
      },
      {start: '2016-06-30T17:00:00',
        end: '2016-06-30T18:00:00',
        title: 'Case worker meeting'
      },
      {start: '2016-07-07T17:00:00',
        end: '2016-07-07T18:00:00',
        title: 'Case worker meeting'
      },
      {start: '2016-07-14T17:00:00',
        end: '2016-07-14T18:00:00',
        title: 'Case worker meeting'
      },
      {start: '2016-07-17T17:00:00',
        end: '2016-07-17T18:00:00',
        title: 'Post-rehab meeting'
      },
      {start: '2016-07-19T13:00:00',
        end: '2016-07-19T15:00:00',
        title: 'Review hearing'
      },
      {start: '2016-07-21T17:00:00',
        end: '2016-07-21T18:00:00',
        title: 'Case worker meeting'
      },
      {start: '2016-07-28T17:00:00',
        end: '2016-07-28T18:00:00',
        title: 'Case worker meeting'
      },
      {start: '2016-08-04T17:00:00',
        end: '2016-08-04T18:00:00',
        title: 'Case worker meeting'
      },
      {start: '2016-08-10T11:00:00',
        end: '2016-08-10T12:00:00',
        title: 'Counseling session'
      },
      {start: '2016-10-15T12:00:00',
        end: '2016-10-15T12:00:00',
        title: 'Deadline to complete anger management courses'
      },
      {start: '2016-08-18T17:00:00',
        end: '2016-08-18T18:00:00',
        title: 'Case worker meeting'
      },
      {start: '2016-08-21T17:00:00',
        end: '2016-08-21T18:00:00',
        title: 'Post-rehab meeting'
      },
      {start: '2016-08-24T11:00:00',
        end: '2016-08-24T12:00:00',
        title: 'Counseling session'
      },
      {start: '2016-09-01T17:00:00',
        end: '2016-09-01T18:00:00',
        title: 'Case worker meeting'
      },
      {start: '2016-09-07T11:00:00',
        end: '2016-09-07T12:00:00',
        title: 'Counseling session'
      },
      {start: '2016-09-15T17:00:00',
        end: '2016-09-15T18:00:00',
        title: 'Case worker meeting'
      },
      {start: '2016-09-18T17:00:00',
        end: '2016-09-18T18:00:00',
        title: 'Post-rehab meeting'
      },
      {start: '2016-09-21T11:00:00',
        end: '2016-09-21T12:00:00',
        title: 'Counseling session'
      },
      {start: '2016-10-05T11:00:00',
        end: '2016-10-05T12:00:00',
        title: 'Counseling session'
      },
      {start: '2016-10-16T17:00:00',
        end: '2016-10-16T18:00:00',
        title: 'Post-rehab meeting'
      },
      {start: '2016-10-19T11:00:00',
        end: '2016-10-19T12:00:00',
        title: 'Counseling session'
      },
      {start: '2016-11-02T11:00:00',
        end: '2016-11-02T12:00:00',
        title: 'Counseling session'
      },
      {start: '2016-11-16T11:00:00',
        end: '2016-11-16T12:00:00',
        title: 'Counseling session'
      },
      {start: '2016-11-18T11:00:00',
        end: '2016-11-18T12:00:00',
        title: 'Potential reunification hearing'
      },
      {start: '2016-11-20T17:00:00',
        end: '2016-11-20T18:00:00',
        title: 'Post-rehab meeting'
      },
      {start: '2016-11-30T11:00:00',
        end: '2016-11-30T12:00:00',
        title: 'Counseling session'
      },
      {start: '2016-12-14T11:00:00',
        end: '2016-12-14T12:00:00',
        title: 'Counseling session'
      },
      {start: '2016-12-18T17:00:00',
        end: '2016-12-18T18:00:00',
        title: 'Post-rehab meeting'
      }
    ]);
  
    var requirements = ko.observableArray([
      {goal: 'Achieve sobriety before reunification',
        requirement: 'Completion of residential drug rehabilitation program',
        duration: '60 day live-in program',
        approval: 'Program administrator and case worker approval',
        progress: 'Program completed; approval obtained',
        notes: 'Currently completing post-program requirements (attend monthly meetings) to maintain sobriety',
        title: 'Drug and Alcohol Rehabilitation'
      },
      {goal: 'Complete in-person parenting course',
        requirement: 'Completion of "Positive Parenting" course at Child Parent Institute',
        duration: '3 sessions, 2 hours each',
        approval: 'Course administrator and case worker approval',
        progress: 'Enrolled; 1 of 3 courses completed',
        notes: 'Will seek approval from course administrator upon completion of course',
        title: 'Parenting Classes'
      },
      {goal: 'Complete anger management treatment course',
        requirement: 'Completion of online anger management course',
        duration: '24 hour online course (12 modules, 2 hours each)',
        approval: 'Course completion certificate and case worker approval',
        progress: 'Enrolled; 2 of 24 hours completed',
        notes: 'Will seek approval from case worker upon completion of course',
        title: 'Anger Management Classes'
      },
      {goal: 'Receive counseling until reunification ',
        requirement: 'Attend counseling sessions',
        duration: 'Bi-weekly starting in August',
        approval: 'Counselor and case worker approval',
        progress: 'In progress',
        notes: 'Will seek approval from counselor after sessions are complete',
        title: 'Counseling'
      },
      {goal: 'Monitor progress with case worker',
        requirement: 'Regular check-in meetings with case worker',
        duration: 'Weekly from June through July; bi-weekly from August through September; monthly from October through December',
        approval: 'Case worker approval',
        progress: 'In progress',
        notes: 'Track progress on case plan',
        title: 'Case Worker Meetings'
      }
    ]);

    $('#calendar').fullCalendar({
      events: appointments()
    });

    var futureAppointments = ko.computed(function() {
      return _.filter(appointments(), function(item) { 
        return new Date(item.start) > new Date();
      });
    });
    return {
      futureAppointments: futureAppointments,
      requirements: requirements
    };
  };
});
