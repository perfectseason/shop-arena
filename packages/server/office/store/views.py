from django.shortcuts import render
from .tasks import notify_customers



def say_hello(request):
    notify_customers.delay('Hello')
    return render(request, 'hello.html', {'name': 'Mosh'})











# from django.core.mail import EmailMessage
# from django.core.mail.message import BadHeaderError
# from templated_email.mail import BaseEmailMessage

#   try:
#        message = BaseEmailMessage(
#            template_name='emails/hello.html',
#            context={'name': 'Mosh'}
#        )
#        message.send([john@moshby.com])
#        message.attach_file('store/static/images/bag.jpg')
#        message.send()
#     except BadHeaderError:
#         pass