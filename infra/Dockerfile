FROM ubuntu:latest

RUN apt-get clean \
    && apt-get update \
    && apt-get install -y curl openjdk-11-jre

ARG JIRA_VERSION=9.11.3

WORKDIR /opt/jira

RUN curl -L https://www.atlassian.com/software/jira/downloads/binary/atlassian-jira-software-${JIRA_VERSION}.tar.gz | tar -xz --strip-components=1

RUN mkdir -p /var/atlassian/application-data/jira && \
    chown -R daemon:daemon /var/atlassian/application-data/jira

EXPOSE 8080

ENV JIRA_HOME /var/atlassian/application-data/jira

VOLUME ["/var/atlassian/application-data/jira"]

CMD ["/opt/jira/bin/start-jira.sh", "-fg"]
