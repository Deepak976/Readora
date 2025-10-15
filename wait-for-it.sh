#!/usr/bin/env bash
# wait-for-it.sh -- wait for a host and TCP port to become available

set -e

host="$1"
shift
cmd="$@"

until nc -z "$host"; do
  >&2 echo "Waiting for $host to be available..."
  sleep 2
done

>&2 echo "$host is up - executing command"
exec $cmd
