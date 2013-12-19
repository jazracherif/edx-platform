from django.core.management.base import BaseCommand
from optparse import make_option

from xmodule.open_ended_grading_classes.openendedchild import OpenEndedChild
from ...utils import get_descriptor, create_list_from_csv, get_users_from_ids, get_module_for_student


class Command(BaseCommand):
    """
    Command to manually re-post open ended submissions to the grader.
    """

    help = "Usage: openended_post --dry-run <course_id> <problem_location> <student_ids.csv> \n"

    option_list = BaseCommand.option_list + (
        make_option('-n', '--dry-run',
            action='store_true', dest='dry_run', default=False,
            help="Do everything except send the submission to the grader. "),
    )

    def handle(self, *args, **options):

        self.dry_run = options['dry_run']

        if len(args) == 3:
            course_id = args[0]
            location = args[1]
            students_ids = create_list_from_csv(args[2])
        else:
            print self.help
            return

        return

        descriptor = get_descriptor(course_id, location)
        if descriptor is None:
            print "Location not found in course"
            return

        if self.dry_run:
            print "Doing a dry run."
        students = get_users_from_ids(students_ids)
        print "Number of students: {0}".format(students.count())

        for student in students:
            print "------Student {0}:{1}------".format(student.id, student.username)
            try:
                module = get_module_for_student(student, course_id, location)
                if module is None:
                    print "WARNING: No state found."
                    continue

                latest_task = module._xmodule.child_module.get_current_task()
                if latest_task is None:
                    print "WARNING: No state found."
                    continue

                latest_task_state = latest_task.child_state

                if latest_task_state == OpenEndedChild.INITIAL:
                    print "WARNING: No submission."
                elif latest_task_state == OpenEndedChild.POST_ASSESSMENT or latest_task_state == OpenEndedChild.DONE:
                    print "WARNING: Submission already graded."
                elif latest_task_state == OpenEndedChild.ASSESSING:
                    latest_answer = latest_task.latest_answer()
                    if not self.dry_run:
                        latest_task.send_to_grader(latest_answer, latest_task.system)
                    print "Sent submission to grader: {0}".format(latest_answer[:100].encode('utf-8'))
                else:
                    print "WARNING: Invalid task_state: {0}".format(latest_task_state)
            except Exception as err:
                print err
